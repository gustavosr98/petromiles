import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

import { Repository } from 'typeorm';

// SERVICES
import { PointsConversionService } from '@/modules/management/services/points-conversion.service';
import { PaymentsService } from '@/modules/payments/services/payments.service';
import { MailsService } from '@/modules/mails/mails.service';
import { AuthService } from '@/modules/auth/auth.service';
import { CsvService } from '@/modules/third-party-clients/services/csv.service';
import { TransactionService } from '@/modules/transaction/services/transaction.service';
import { ThirdPartyInterestService } from '@/modules/management/services/third-party-interest.service';
import { UserClientService } from '@/modules/user/services/user-client.service';

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

import { MailsSubjets } from '@/constants/mailsSubjectConst';
import { AuthenticatedUser } from '@/interfaces/auth/authenticated-user.interface';
import { StateName, StateDescription } from '@/enums/state.enum';
import { PaymentProvider } from '@/enums/payment-provider.enum';
import { Suscription } from '@/enums/suscription.enum';

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
  ) {}

  async get(apiKey: string): Promise<ThirdPartyClient> {
    return await this.thirdPartyClientsRepository.findOne({ apiKey });
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
    const { userEmail: email, userCode } = associateUserTokenRequest;

    const userClient = await this.userClientRepository.findOne({ email });
    if (!userClient) {
      throw new BadRequestException(
        ThirdPartyClientsErrorCodes.USER_DO_NOT_EXISTS,
      );
    }

    let clientOnThirdParty = await this.clientOnThirdPartyRepository.findOne({
      userClient,
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
  ): Promise<ClientOnThirdParty> {
    return await this.clientOnThirdPartyRepository.findOne({ userClient });
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
    };
    const extras = await this.transactionService.getTransactionInterests(
      optionsExtras,
    );
    return extras;
  }

  private calculateExtraPoints(extraPoints, amount: number) {
    if (!extraPoints) return amount;
    const extra = 1 + parseFloat(extraPoints.percentage);

    if (extraPoints.name === PlatformInterest.PREMIUM_EXTRA)
      return extra * amount;

    if (extraPoints.name === PlatformInterest.GOLD_EXTRA) {
      return amount * extra + parseFloat(extraPoints.amount) / 100;
    }
  }

  async consultPoints(
    addPointsRequest: AddPointsRequest,
    user: AuthenticatedUser,
  ): Promise<AddPointsResponse> {
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

    let pointsToDollars: number = 0;
    let tentativePoints: number = 0;

    const products: Product[] = addPointsRequest.products.map(product => {
      pointsToDollars += (product.priceTag / 100) * accumulatePercentage;

      tentativePoints = Math.trunc(
        this.calculateExtraPoints(
          extras.extraPoints,
          (product.priceTag / 100) * accumulatePercentage,
        ) / mostRecentRate.onePointEqualsDollars,
      );

      return {
        ...product,
        tentativePoints: tentativePoints,
      };
    });

    const commission: number = Math.trunc(
      this.calculateCommission(interests, pointsToDollars) * 100,
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
    const accumulatePercentage = parseFloat(
      (await this.get(addPointsRequest.apiKey)).accumulatePercentage,
    );

    const points: AddPointsResponse = await this.consultPoints(
      addPointsRequest,
      user,
    );

    const userClient: UserClient = await this.userClientService.get({
      email: user.email,
      idUserClient: user.id,
    });
    const clientOnThirdParty: ClientOnThirdParty = await this.getClientOnThirdPartyByUserId(
      userClient,
    );

    const thirdPartyInterest = await this.thirdPartyInterestService.get(
      PaymentProvider.STRIPE,
      TransactionType.WITHDRAWAL,
    );
    const interests = await this.paymentsService.getInterests(
      TransactionType.WITHDRAWAL,
      PlatformInterest.WITHDRAWAL,
    );
    const extras = await this.calculateExtras(userClient);

    let pointsToDollars: number = 0;
    let accumulatedPoints: number = 0;
    points.request.products.forEach(p => {
      pointsToDollars += (p.priceTag / 100) * accumulatePercentage;
      accumulatedPoints += p.tentativePoints;
    });
    const commission: number = Math.trunc(
      this.calculateCommission(interests, pointsToDollars) * 100,
    );

    const options: App.Transaction.TransactionCreation = {
      clientOnThirdParty,
      totalAmountWithInterest: commission,
      rawAmount: Math.trunc(
        this.calculateExtraPoints(
          extras.extraPoints,
          Math.trunc(pointsToDollars * 100),
        ),
      ),
      type: TransactionType.THIRD_PARTY_CLIENT,
      pointsConversion: extras.pointsConversion,
      platformInterest: extras.interest,
      thirdPartyInterest,
      platformInterestExtraPoints: extras.extraPoints,
      stateTransactionDescription:
        StateDescription.THIRD_PARTY_CLIENT_TRANSACTION,
      operation: 1,
    };

    const transaction = await this.transactionService.createTransaction(
      options,
      StateName.VERIFYING,
    );

    const confirmationTicket: ConfirmationTicket = {
      confirmationId: transaction.idTransaction.toString(),
      userEmail: user.email,
      date: new Date(),
      currency: addPointsRequest.products[0].currency,
      pointsToDollars: Math.trunc(pointsToDollars * 100),
      accumulatedPoints,
      commission,
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
    const confirmationTickets: ConfirmationTicket[] = await this.csvService.toJSON<
      ConfirmationTicket
    >(file, [
      'confirmationId',
      'date',
      'userEmail',
      'priceTag',
      'accumulatedPoints',
    ]);
    return confirmationTickets;
  }
}
