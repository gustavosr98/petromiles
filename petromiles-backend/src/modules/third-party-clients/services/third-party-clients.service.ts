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

  async addPoints(
    addPointsRequest: AddPointsRequest,
  ): Promise<AddPointsResponse> {
    if (addPointsRequest.type === AddPointsRequestType.CONSULT) {
      return await this.consultPoints(addPointsRequest);
    }
  }
  calculateTentativeCommission(interests: Interest[], dollars: number): number {
    let tentativeCommission: number = dollars;
    interests.map(i => {
      tentativeCommission =
        tentativeCommission - (dollars * i.percentage + i.amount / 100);
    });
    return dollars - tentativeCommission;
  }
  async consultPoints(
    addPointsRequest: AddPointsRequest,
  ): Promise<AddPointsResponse> {
    const mostRecentRate = await this.pointsConversionService.getRecentPointsConversion();
    const accumulatePercentage = parseFloat(
      (await this.get(addPointsRequest.apiKey)).accumulatePercentage,
    );
    const interests = await this.paymentsService.getInterests(
      TransactionType.WITHDRAWAL,
      PlatformInterest.WITHDRAWAL,
    );

    let tentativeCommission: number = 0;
    let tentativePoints: number = 0;

    const products: Product[] = addPointsRequest.products.map(product => {
      tentativePoints = Math.trunc(
        ((product.priceTag / 100) * accumulatePercentage) /
          mostRecentRate.onePointEqualsDollars,
      );

      tentativeCommission = Math.trunc(
        this.calculateTentativeCommission(
          interests,
          (product.priceTag / 100) * accumulatePercentage,
        ) * 100,
      );

      return {
        ...product,
        tentativeCommission: tentativeCommission,
        tentativePoints: tentativePoints,
      };
    });

    const response: AddPointsResponse = {
      request: {
        ...addPointsRequest,
        products,
      },
      confirmationTicket: null,
    };

    return response;
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
