import { Transaction } from '@/entities/transaction.entity';
import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

import { Repository, UpdateResult, getConnection } from 'typeorm';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

// SERVICES
import { PointsConversionService } from '@/modules/management/services/points-conversion.service';
import { PaymentsService } from '@/modules/payments/services/payments.service';
import { MailsService } from '@/modules/mails/mails.service';
import { AuthService } from '@/modules/auth/auth.service';
import { CsvService } from '@/modules/third-party-clients/services/csv.service';
import { TransactionService } from '@/modules/transaction/services/transaction.service';
import { ThirdPartyInterestService } from '@/modules/management/services/third-party-interest.service';
import { UserClientService } from '@/modules/user/services/user-client.service';
import { StateTransactionService } from '@/modules/transaction/services/state-transaction.service';

// ENTITIES
import { ThirdPartyClient } from '@/entities/third-party-client.entity';
import { UserClient } from '@/entities/user-client.entity';
import { ClientOnThirdParty } from '@/entities/client-on-third-party.entity';

// INTERFACES
import { AddPointsRequest } from '@/modules/third-party-clients/dto/add-points-request.dto';
import { Product } from '@/modules/third-party-clients/dto/product.dto';
import { AssociateUserCodeRequest } from '@/modules/third-party-clients/dto/associate-user-code-request.dto';
import { AssociateUserTokenRequest } from '@/modules/third-party-clients/dto/associate-user-token-request.dto';
import { AddPointsResponse } from '@/interfaces/third-party-clients/add-points-response.interface';
import { Interest } from '@/modules/payments/interest.interface';
import { ConfirmationTicket } from '@/interfaces/third-party-clients/confirmation-ticket.interface';
import { AssociateUserCodeResponse } from '@/interfaces/third-party-clients/associate-user-code-response.interface';
import { AssociateUserTokenResponse } from '@/interfaces/third-party-clients/associate-user-token-response.interface';
import { MailsStructure } from '@/interfaces/mails/mails-structure.interface';
import { TransactionType } from '@/enums/transaction.enum';
import { PlatformInterest } from '@/enums/platform-interest.enum';
import { AddPointsRequestType } from '@/enums/add-points-request-type.enum';
import { Role } from '@/enums/role.enum';
import { ThirdPartyClientsErrorCodes } from '@/enums/third-party-clients-error-codes.enum';
import { ThirdPartyClientResponseStatus } from '@/enums/third-party-clients-response-status.enum';
import { MailsResponse } from '@/enums/mails-response.enum';
import { TransactionDetails } from '@/modules/transaction/interfaces/transaction-details.interface';
import { MailsSubjets } from '@/constants/mailsSubjectConst';
import { AuthenticatedUser } from '@/interfaces/auth/authenticated-user.interface';
import { StateName, StateDescription } from '@/enums/state.enum';
import { PaymentProvider } from '@/enums/payment-provider.enum';
import { Suscription } from '@/enums/suscription.enum';
import { ApiModules } from '@/logger/api-modules.enum';
import {
  CsvProcessResult,
  CsvApiError,
  CsvProcessDescription,
} from '@/enums/csv-process';
import { CsvProcessDetails } from '@/interfaces/third-party-clients/csv-process';

@Injectable()
export class ThirdPartyClientsService {
  constructor(
    @InjectRepository(ThirdPartyClient)
    private readonly thirdPartyClientsRepository: Repository<ThirdPartyClient>,
    @InjectRepository(UserClient)
    private readonly userClientRepository: Repository<UserClient>,
    @InjectRepository(ClientOnThirdParty)
    private readonly clientOnThirdPartyRepository: Repository<
      ClientOnThirdParty
    >,
    private readonly mailsService: MailsService,
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
    private readonly pointsConversionService: PointsConversionService,
    private readonly paymentsService: PaymentsService,
    private readonly csvService: CsvService,
    private readonly transactionService: TransactionService,
    private readonly thirdPartyInterestService: ThirdPartyInterestService,
    private readonly userClientService: UserClientService,
    private readonly stateTransactionService: StateTransactionService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async get(apiKey: string): Promise<ThirdPartyClient> {
    return await this.thirdPartyClientsRepository.findOne({ apiKey });
  }

  async getAll(): Promise<ThirdPartyClient[]> {
    return await this.thirdPartyClientsRepository.find();
  }

  async update(
    idThirdPartyClient: number,
    accumulatePercentage: string,
  ): Promise<UpdateResult> {
    const result = await this.thirdPartyClientsRepository.update(
      { idThirdPartyClient },
      { accumulatePercentage },
    );

    this.logger.warn(
      `[${
        ApiModules.THIRD_PARTY_CLIENTS
      }] Third party interest: ID =  [${idThirdPartyClient}] updated | New percentage = [${parseFloat(
        accumulatePercentage,
      ) * 100} $]`,
    );

    return result;
  }

  async associateUserCode(
    associateUserCodeRequest: AssociateUserCodeRequest,
  ): Promise<AssociateUserCodeResponse> {
    const { userEmail: email, apiKey } = associateUserCodeRequest;

    const thirdPartyClient = await this.get(apiKey);

    const userClient = await this.userClientRepository.findOne({ email });
    if (!userClient) {
      throw new BadRequestException(
        ThirdPartyClientsErrorCodes.USER_DO_NOT_EXISTS,
      );
    }

    const code = this.generateRandomCode();
    await this.saveClientOnThirdParty(userClient, thirdPartyClient, code);

    const mailResponse = await this.sendVerificationCodeEmail(
      userClient,
      thirdPartyClient.name,
      code,
    );

    const codeResponse: AssociateUserCodeResponse = {
      request: associateUserCodeRequest,
      responseStatus:
        mailResponse === MailsResponse.SUCCESS
          ? ThirdPartyClientResponseStatus.SUCCESSFUL
          : ThirdPartyClientResponseStatus.FAILD,
    };
    return codeResponse;
  }
  private generateRandomCode(): string {
    return Math.floor(10000000 + Math.random() * 90000000).toString();
  }
  private async sendVerificationCodeEmail(
    userClient: UserClient,
    thirdPartyClientName: string,
    code: string,
  ): Promise<MailsResponse> {
    const language = userClient.userDetails.language.name;

    const template = `sendVerificationCodeEmail[${language}]`;
    const subject = MailsSubjets.verification_code[language];

    const msg: MailsStructure = {
      to: userClient.email,
      subject: subject,
      templateId: this.configService.get<string>(
        `mails.sendgrid.templates.${template}`,
      ),
      dynamic_template_data: {
        user: userClient.userDetails.firstName,
        thirdPartyClientName,
        code,
      },
    };
    return await this.mailsService.sendEmail(msg);
  }

  private async saveClientOnThirdParty(
    userClient: UserClient,
    thirdPartyClient: ThirdPartyClient,
    code: string,
  ): Promise<ClientOnThirdParty> {
    let clientOnThirdParty = await this.clientOnThirdPartyRepository.findOne({
      userClient,
      thirdPartyClient,
    });

    if (!clientOnThirdParty) {
      clientOnThirdParty = await this.clientOnThirdPartyRepository.create({
        userClient,
        code,
        thirdPartyClient,
      });
    } else {
      const expirationDate = new Date();
      expirationDate.setHours(expirationDate.getHours() + 1);
      clientOnThirdParty.code = code;
      clientOnThirdParty.expirationDate = expirationDate;
    }

    return await this.clientOnThirdPartyRepository.save(clientOnThirdParty);
  }

  async associateUserToken(
    associateUserTokenRequest: AssociateUserTokenRequest,
  ): Promise<AssociateUserTokenResponse> {
    const { userEmail: email, userCode, apiKey } = associateUserTokenRequest;

    const thirdPartyClient = await this.get(apiKey);
    const userClient = await this.userClientRepository.findOne({ email });
    if (!userClient) {
      throw new BadRequestException(
        ThirdPartyClientsErrorCodes.USER_DO_NOT_EXISTS,
      );
    }

    let clientOnThirdParty = await this.clientOnThirdPartyRepository.findOne({
      userClient,
      thirdPartyClient,
    });

    if (!clientOnThirdParty)
      throw new BadRequestException(
        ThirdPartyClientsErrorCodes.CLIENT_NOT_ASSOCIATED,
      );

    const codeValidation = clientOnThirdParty.isCodeValid(userCode);

    if (!codeValidation.valid)
      throw new BadRequestException(codeValidation.error);

    clientOnThirdParty.expirationDate = new Date();
    await this.clientOnThirdPartyRepository.save(clientOnThirdParty);

    const tokeResponse: AssociateUserTokenResponse = {
      request: associateUserTokenRequest,
      userToken: this.authService.createToken(email, Role.THIRD_PARTY),
    };

    return tokeResponse;
  }

  private calculateCommission(interests: Interest[], dollars: number): number {
    let tentativeCommission: number = dollars;
    interests.map(i => {
      tentativeCommission =
        tentativeCommission - (dollars * i.percentage + i.amount / 100);
    });
    return dollars - tentativeCommission;
  }

  async getClientOnThirdPartyByUserId(
    userClient: UserClient,
    thirdPartyClient: ThirdPartyClient,
  ): Promise<ClientOnThirdParty> {
    return await this.clientOnThirdPartyRepository.findOne({
      userClient,
      thirdPartyClient,
    });
  }

  private chooseExtraPoints(suscriptionType): PlatformInterest {
    if (suscriptionType == Suscription.BASIC) return null;
    if (suscriptionType == Suscription.PREMIUM)
      return PlatformInterest.PREMIUM_EXTRA;
    return PlatformInterest.GOLD_EXTRA;
  }

  async calculateExtras(userClient: UserClient) {
    const currentUserSuscription = await userClient.userSuscription.find(
      suscription => !suscription.finalDate,
    );
    const extraPointsType = this.chooseExtraPoints(
      currentUserSuscription.suscription.name,
    );
    const optionsExtras: App.Transaction.TransactionInterests = {
      platformInterestType: PlatformInterest.WITHDRAWAL,
      platformInterestExtraPointsType: extraPointsType,
      thirdPartyInterestType: PaymentProvider.STRIPE,
      type: TransactionType.WITHDRAWAL,
    };
    const extras = await this.transactionService.getTransactionInterests(
      optionsExtras,
    );
    return extras;
  }

  private calculateExtraPoints(
    extraPoints,
    amount: number,
    conversion: number,
  ) {
    if (!extraPoints) return amount;
    const extra = 1 + parseFloat(extraPoints.percentage);

    if (extraPoints.name === PlatformInterest.PREMIUM_EXTRA)
      return extra * amount;

    if (extraPoints.name === PlatformInterest.GOLD_EXTRA) {
      return amount * extra + parseFloat(extraPoints.points) * conversion;
    }
  }

  async consultPoints(
    addPointsRequest: AddPointsRequest,
    user: AuthenticatedUser,
  ): Promise<AddPointsResponse> {
    const { type } = addPointsRequest;
    const userClient: UserClient = await this.userClientService.get({
      email: user.email,
      idUserClient: user.id,
    });
    const mostRecentRate = await this.pointsConversionService.getRecentPointsConversion();
    const accumulatePercentage = parseFloat(
      (await this.get(addPointsRequest.apiKey)).accumulatePercentage,
    );
    const interests = await this.paymentsService.getInterests(
      TransactionType.WITHDRAWAL,
      PlatformInterest.WITHDRAWAL,
    );
    const extras = await this.calculateExtras(userClient);

    let tentativePoints: number = 0;
    let accumulatedPoints: number = 0;

    const products: Product[] = addPointsRequest.products.map(product => {
      tentativePoints = Math.round(
        Math.round(
          this.calculateExtraPoints(
            extras.extraPoints,
            (product.priceTag / 100) * accumulatePercentage,
            mostRecentRate.onePointEqualsDollars,
          ) * 10000,
        ) /
          10000 /
          mostRecentRate.onePointEqualsDollars,
      );

      accumulatedPoints += tentativePoints;

      return {
        ...product,
        tentativePoints: tentativePoints,
      };
    });

    const rawAmount =
      Math.round(
        accumulatedPoints * mostRecentRate.onePointEqualsDollars * 10000,
      ) / 100;

    const commission: number = Math.trunc(
      Math.round(this.calculateCommission(interests, rawAmount / 100) * 10000) /
        100,
    );

    if (type == AddPointsRequestType.CONSULT)
      this.logger.info(
        `[${ApiModules.THIRD_PARTY_CLIENTS}] [addPoints-${type}]  | Tentative commission= [$ ${commission} cents] `,
      );

    const response: AddPointsResponse = {
      request: {
        ...addPointsRequest,
        products,
        totalTentativeCommission: commission,
      },
      confirmationTicket: null,
    };

    return response;
  }

  async createTransaction(
    addPointsRequest: AddPointsRequest,
    user: AuthenticatedUser,
  ): Promise<AddPointsResponse> {
    const { type } = addPointsRequest;
    const points: AddPointsResponse = await this.consultPoints(
      addPointsRequest,
      user,
    );

    const thirdPartyClient = await this.get(addPointsRequest.apiKey);

    const userClient: UserClient = await this.userClientService.get({
      email: user.email,
      idUserClient: user.id,
    });
    const clientOnThirdParty: ClientOnThirdParty = await this.getClientOnThirdPartyByUserId(
      userClient,
      thirdPartyClient,
    );

    if (!clientOnThirdParty)
      throw new BadRequestException(
        ThirdPartyClientsErrorCodes.UNKNOWN_API_KEY,
      );

    const mostRecentRate = await this.pointsConversionService.getRecentPointsConversion();
    const thirdPartyInterest = await this.thirdPartyInterestService.get(
      PaymentProvider.STRIPE,
      TransactionType.WITHDRAWAL,
    );
    const extras = await this.calculateExtras(userClient);

    let accumulatedPoints: number = 0;
    points.request.products.forEach(p => {
      accumulatedPoints += p.tentativePoints;
    });

    const rawAmount =
      Math.round(
        accumulatedPoints * mostRecentRate.onePointEqualsDollars * 10000,
      ) / 100;

    const interests = await this.paymentsService.getInterests(
      TransactionType.WITHDRAWAL,
      PlatformInterest.WITHDRAWAL,
    );

    const commission: number =
      Math.round(this.calculateCommission(interests, rawAmount / 100) * 10000) /
      100;

    const options: App.Transaction.TransactionCreation = {
      clientOnThirdParty,
      totalAmountWithInterest: commission,
      rawAmount,
      type: TransactionType.THIRD_PARTY_CLIENT,
      pointsConversion: extras.pointsConversion,
      platformInterest: extras.interest,
      thirdPartyInterest,
      platformInterestExtraPoints: extras.extraPoints,
      stateTransactionDescription:
        StateDescription.THIRD_PARTY_CLIENT_TRANSACTION,
      operation: 1,
    };

    this.logger.silly(
      `[${
        ApiModules.THIRD_PARTY_CLIENTS
      }] [addPoints-${type}] Transaction to be created:  Amount to points = [$ ${Math.trunc(
        rawAmount,
      )} cents] | Commission= [$ ${
        points.request.totalTentativeCommission
      } cents] | Accumulated points= [${accumulatedPoints}] `,
    );

    const transaction = await this.transactionService.createTransaction(
      options,
      StateName.VERIFYING,
    );

    const confirmationTicket: ConfirmationTicket = {
      confirmationId: transaction.idTransaction.toString(),
      userEmail: user.email,
      date: transaction.initialDate.toISOString(),
      currency: addPointsRequest.products[0].currency,
      pointsToDollars: Math.trunc(rawAmount),
      accumulatedPoints,
      commission: points.request.totalTentativeCommission,
      status: StateName.VERIFYING,
    };

    const response: AddPointsResponse = {
      request: points.request,
      confirmationTicket: confirmationTicket,
    };

    return response;
  }

  async addPoints(
    addPointsRequest: AddPointsRequest,
    user: AuthenticatedUser,
  ): Promise<AddPointsResponse> {
    if (addPointsRequest.type === AddPointsRequestType.CONSULT) {
      return await this.consultPoints(addPointsRequest, user);
    } else if (addPointsRequest.type === AddPointsRequestType.CREATION) {
      return await this.createTransaction(addPointsRequest, user);
    }
  }

  async csvCheck(apiKey: string, file): Promise<ConfirmationTicket[]> {
    let theirConfirmationTickets: ConfirmationTicket[] = await this.csvService.toJSON<
      ConfirmationTicket
    >(file, [
      'confirmationId',
      'apiKey',
      'date',
      'userEmail',
      'pointsToDollars',
      'commission',
      'accumulatedPoints',
    ]);
    this.checkApiKeyConsistency({ apiKey, theirConfirmationTickets });

    const theirConfirmationTicketsIds: number[] = theirConfirmationTickets.map(
      confirmationTicket => parseInt(confirmationTicket.confirmationId),
    );
    this.checkRepeatedTransactionIds({ apiKey, theirConfirmationTicketsIds });

    const transactions: TransactionDetails[] = await this.transactionService.getThirdPartyTransactions(
      {
        apiKey,
        filter: {
          transactionIds: theirConfirmationTicketsIds,
        },
      },
    );

    const processedConfirmationTickets = theirConfirmationTickets.map(
      theirConfirmationTicket => {
        let logPrefix: string = `[${
          ApiModules.THIRD_PARTY_CLIENTS
        }] [CSV] {apiKey: ${apiKey.substr(0, 2)}..${apiKey.substr(
          -4,
        )}} (confirmationId: ${theirConfirmationTicket.confirmationId}): `;

        let processingDetails: CsvProcessDetails = {
          description: [],
          result: null,
          state: null,
        };

        try {
          const ourTransaction = transactions.find(
            transaction =>
              transaction.id ===
              parseInt(theirConfirmationTicket.confirmationId),
          );

          if (!!ourTransaction) {
            const ourConfirmationTicket = {
              confirmationId: ourTransaction.id,
              date: new Date(ourTransaction.fullDate),
              userEmail: ourTransaction.clientBankAccountEmail,
              pointsToDollars: Math.trunc(ourTransaction.amount * 100),
              commission: Math.trunc(ourTransaction.interest * 100),
              accumulatedPoints: Math.trunc(
                ourTransaction.pointsEquivalent + ourTransaction.extra,
              ),
              state: ourTransaction.state,
            };

            if (ourConfirmationTicket.state !== StateName.VERIFYING) {
              processingDetails.result = CsvProcessResult.MAINTAIN;
              processingDetails.state =
                StateName[ourConfirmationTicket.state.toUpperCase()];
            } else if (
              ourConfirmationTicket.userEmail ===
                theirConfirmationTicket.userEmail &&
              ourConfirmationTicket.pointsToDollars ==
                theirConfirmationTicket.pointsToDollars &&
              ourConfirmationTicket.commission ==
                theirConfirmationTicket.commission &&
              ourConfirmationTicket.accumulatedPoints ==
                theirConfirmationTicket.accumulatedPoints &&
              ourConfirmationTicket.date.toISOString() ==
                theirConfirmationTicket.date
            ) {
              processingDetails.result = CsvProcessResult.VALID;
              processingDetails.state = StateName.VALID;
            } else {
              processingDetails.result = CsvProcessResult.INVALID;
              processingDetails.state = StateName.INVALID;

              this.addInvalidDescription({
                ourConfirmationTicket,
                theirConfirmationTicket,
                processingDetails,
              });
            }
          } else {
            processingDetails.result = CsvProcessResult.MAINTAIN;
            processingDetails.description.push(
              CsvProcessDescription.NOT_EXISTING_TRANSACTION_ID,
            );
            processingDetails.state = StateName.INVALID;
          }

          this.internalTicketProcessing({
            apiKey,
            confirmationTicket: theirConfirmationTicket,
            processingDetails,
          });
        } catch (e) {
          this.logger.error(logPrefix + e);
          processingDetails.result = CsvProcessResult.MAINTAIN;
          processingDetails.description.push(
            CsvProcessDescription.WRONG_TYPE_OF_VALUES,
          );
          processingDetails.state = StateName.INVALID;
        } finally {
          const logContent =
            logPrefix +
            `(Result: ${processingDetails.result} | Final state: ${
              processingDetails.state
            } | ${processingDetails.description.toString()})`;

          if (processingDetails.result === CsvProcessResult.MAINTAIN)
            this.logger.info(logContent);
          else if (processingDetails.result === CsvProcessResult.VALID)
            this.logger.verbose(logContent);
          else if (processingDetails.result === CsvProcessResult.INVALID)
            this.logger.error(logContent);
          return {
            ...theirConfirmationTicket,
            status: processingDetails.state,
          };
        }
      },
    );

    return processedConfirmationTickets;
  }

  private async internalTicketProcessing({
    apiKey,
    confirmationTicket,
    processingDetails,
  }: {
    apiKey: string;
    confirmationTicket: ConfirmationTicket;
    processingDetails: CsvProcessDetails;
  }): Promise<void> {
    if (
      processingDetails.result === CsvProcessResult.VALID ||
      processingDetails.result === CsvProcessResult.INVALID
    ) {
      const transaction = await getConnection()
        .getRepository(Transaction)
        .findOne({
          idTransaction: parseInt(confirmationTicket.confirmationId),
        });

      await this.stateTransactionService.update(
        processingDetails.state,
        transaction,
        processingDetails.description.toString().toUpperCase(),
      );

      await this.sendPointsStatusEmail(
        confirmationTicket.userEmail,
        apiKey,
        confirmationTicket.accumulatedPoints,
        processingDetails.state,
      );
    }
  }

  private addInvalidDescription({
    ourConfirmationTicket,
    theirConfirmationTicket,
    processingDetails,
  }) {
    if (
      ourConfirmationTicket.date.toISOString() !== theirConfirmationTicket.date
    ) {
      processingDetails.description.push(
        CsvProcessDescription.NO_MATCH_DATE +
          `: ${ourConfirmationTicket.date.toISOString()} != ${
            theirConfirmationTicket.date
          }`,
      );
    }

    if (ourConfirmationTicket.userEmail !== theirConfirmationTicket.userEmail) {
      processingDetails.description.push(
        CsvProcessDescription.NO_MATCH_USER_EMAIL +
          `: ${ourConfirmationTicket.userEmail} != ${theirConfirmationTicket.userEmail}`,
      );
    }
    if (
      ourConfirmationTicket.pointsToDollars !=
      theirConfirmationTicket.pointsToDollars
    ) {
      processingDetails.description.push(
        CsvProcessDescription.NO_MATCH_POINTS_TO_DOLLARS +
          `: ${ourConfirmationTicket.pointsToDollars} != ${theirConfirmationTicket.pointsToDollars}`,
      );
    }
    if (
      ourConfirmationTicket.commission != theirConfirmationTicket.commission
    ) {
      processingDetails.description.push(
        CsvProcessDescription.NO_MATCH_COMMISSION +
          `: ${ourConfirmationTicket.commission} != ${theirConfirmationTicket.commission}`,
      );
    }
    if (
      ourConfirmationTicket.accumulatedPoints !=
      theirConfirmationTicket.accumulatedPoints
    ) {
      processingDetails.description.push(
        CsvProcessDescription.NO_MATCH_ACCUMULATED_POINTS +
          `: ${ourConfirmationTicket.accumulatedPoints} != ${theirConfirmationTicket.accumulatedPoints}`,
      );
    }
  }

  private checkApiKeyConsistency(params: {
    apiKey: string;
    theirConfirmationTickets: ConfirmationTicket[];
  }): void {
    const allEquals: boolean = params.theirConfirmationTickets.every(
      ticket => ticket.apiKey === params.apiKey,
    );

    if (!allEquals) {
      this.logger.error(
        `[${
          ApiModules.THIRD_PARTY_CLIENTS
        }] [CSV] {apiKey: ${params.apiKey.substr(0, 2)}..${params.apiKey.substr(
          -4,
        )}} ${CsvApiError.APIKEY_INCONSISTENCY}`,
      );
      throw new BadRequestException(CsvApiError.APIKEY_INCONSISTENCY);
    }
  }

  private checkRepeatedTransactionIds(params: {
    apiKey: string;
    theirConfirmationTicketsIds: number[];
  }): void {
    if (
      new Set(params.theirConfirmationTicketsIds).size !==
      params.theirConfirmationTicketsIds.length
    ) {
      this.logger.error(
        `[${
          ApiModules.THIRD_PARTY_CLIENTS
        }] [CSV] {apiKey: ${params.apiKey.substr(0, 2)}..${params.apiKey.substr(
          -4,
        )}} ${CsvApiError.REPEATED_TRANSACTION_IDS}`,
      );
      throw new BadRequestException(CsvApiError.REPEATED_TRANSACTION_IDS);
    }
  }

  private async sendPointsStatusEmail(
    userEmail: string,
    apiKey: string,
    accumulatedPoints: number,
    status: string,
  ): Promise<MailsResponse> {
    const thirdPartyClient = await this.get(apiKey);
    const userClient = await this.userClientRepository.findOne({
      email: userEmail,
    });
    const language = userClient.userDetails.language.name;

    if (status === StateName.VALID) {
      const template = `customerPointsAccumulationApproval[${language}]`;
      const subject =
        MailsSubjets.customer_points_accumulation_approval[language];

      const msg: MailsStructure = {
        to: userClient.email,
        subject: subject,
        templateId: this.configService.get<string>(
          `mails.sendgrid.templates.${template}`,
        ),
        dynamic_template_data: {
          user: userClient.userDetails.firstName,
          thirdPartyClientName: thirdPartyClient.name,
          numberPoints: accumulatedPoints,
        },
      };
      return await this.mailsService.sendEmail(msg);
    } else if (status === StateName.INVALID) {
      const template = `customerPointsAccumulationRejection[${language}]`;
      const subject =
        MailsSubjets.customer_points_accumulation_rejection[language];

      const msg: MailsStructure = {
        to: userClient.email,
        subject: subject,
        templateId: this.configService.get<string>(
          `mails.sendgrid.templates.${template}`,
        ),
        dynamic_template_data: {
          user: userClient.userDetails.firstName,
          thirdPartyClientName: thirdPartyClient.name,
          numberPoints: accumulatedPoints,
        },
      };
      return await this.mailsService.sendEmail(msg);
    }
  }
}
