import { PaymentProvider } from '@/enums/payment-provider.enum';
import { StateName, StateDescription } from '@/enums/state.enum';
import { PlatformInterest } from '@/enums/platform-interest.enum';
import { TransactionType } from '@/enums/transaction.enum';
import { AddPointsRequestType } from '@/enums/add-points-request-type.enum';
import { Role } from '@/enums/role.enum';
import { BadRequestException } from '@nestjs/common';
import { ThirdPartyClientResponseStatus } from '@/enums/third-party-clients-response-status.enum';
import { MailsResponse } from '@/enums/mails-response.enum';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { ThirdPartyClientsService } from './third-party-clients.service';
import { Repository, UpdateResult } from 'typeorm';
import { ConfigService } from '@nestjs/config';

import { StateTransactionService } from '@/modules/transaction/services/state-transaction.service';
import { UserClientService } from '@/modules/user/services/user-client.service';
import { ThirdPartyInterestService } from '@/modules/management/services/third-party-interest.service';
import { TransactionService } from '@/modules/transaction/services/transaction.service';
import { CsvService } from '@/modules/third-party-clients/services/csv.service';
import { PaymentsService } from '@/modules/payments/services/payments.service';
import { PointsConversionService } from '@/modules/management/services/points-conversion.service';
import { AuthService } from '@/modules/auth/auth.service';
import { MailsService } from '@/modules/mails/mails.service';
import { ClientOnThirdParty } from '@/entities/client-on-third-party.entity';
import { UserClient } from '@/entities/user-client.entity';
import { ThirdPartyClient } from '@/entities/third-party-client.entity';

import { WinstonModule } from 'nest-winston';
import createOptions from '../../../logger/winston/winston-config';

describe('ThirdPartyClientsService', () => {
  let thirdPartyClientsService: ThirdPartyClientsService;
  let RepositoryMock: jest.Mock;
  let thirdPartyClientsRepository: Repository<ThirdPartyClient>;
  let userClientRepository: Repository<UserClient>;
  let clientOnThirdPartyRepository: Repository<ClientOnThirdParty>;
  let MailsServiceMock: jest.Mock<Partial<MailsService>>;
  let mailsService: MailsService;
  let ConfigServiceMock: jest.Mock<Partial<ConfigService>>;
  let configService: ConfigService;
  let AuthServiceMock: jest.Mock<Partial<AuthService>>;
  let authService: AuthService;
  let PointsConversionServiceMock: jest.Mock<Partial<PointsConversionService>>;
  let pointsConversionService: PointsConversionService;
  let PaymentsServiceMock: jest.Mock<Partial<PaymentsService>>;
  let paymentsService: PaymentsService;
  let CsvServiceMock: jest.Mock<Partial<CsvService>>;
  let csvService: CsvService;
  let TransactionServiceMock: jest.Mock<Partial<TransactionService>>;
  let transactionService: TransactionService;
  let ThirdPartyInterestServiceMock: jest.Mock<Partial<
    ThirdPartyInterestService
  >>;
  let thirdPartyInterestService: ThirdPartyInterestService;
  let UserClientServiceMock: jest.Mock<Partial<UserClientService>>;
  let userClientService: UserClientService;
  let StateTransactionServiceMock: jest.Mock<Partial<StateTransactionService>>;
  let stateTransactionService: StateTransactionService;

  beforeEach(() => {
    RepositoryMock = jest.fn(() => ({
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    }));
    MailsServiceMock = jest.fn<Partial<MailsService>, MailsService[]>(() => ({
      sendEmail: jest.fn(),
    }));
    ConfigServiceMock = jest.fn<Partial<ConfigService>, ConfigService[]>(
      () => ({
        get: jest.fn(),
      }),
    );
    AuthServiceMock = jest.fn<Partial<AuthService>, AuthService[]>(() => ({
      createToken: jest.fn(),
    }));
    PointsConversionServiceMock = jest.fn<
      Partial<PointsConversionService>,
      PointsConversionService[]
    >(() => ({
      getRecentPointsConversion: jest.fn(),
    }));
    PaymentsServiceMock = jest.fn<Partial<PaymentsService>, PaymentsService[]>(
      () => ({
        getInterests: jest.fn(),
      }),
    );
    CsvServiceMock = jest.fn<Partial<CsvService>, CsvService[]>(() => ({
      toJSON: jest.fn(),
    }));
    TransactionServiceMock = jest.fn<
      Partial<TransactionService>,
      TransactionService[]
    >(() => ({
      getTransactionInterests: jest.fn(),
      createTransaction: jest.fn(),
      getThirdPartyTransactions: jest.fn(),
    }));
    ThirdPartyInterestServiceMock = jest.fn<
      Partial<ThirdPartyInterestService>,
      ThirdPartyInterestService[]
    >(() => ({
      get: jest.fn(),
    }));
    UserClientServiceMock = jest.fn<
      Partial<UserClientService>,
      UserClientService[]
    >(() => ({
      get: jest.fn(),
    }));
    StateTransactionServiceMock = jest.fn<
      Partial<StateTransactionService>,
      StateTransactionService[]
    >(() => ({
      update: jest.fn(),
    }));
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        WinstonModule.forRoot(
          createOptions({ fileName: 'petromiles-global.log' }),
        ),
      ],
      providers: [
        ThirdPartyClientsService,
        {
          provide: getRepositoryToken(ThirdPartyClient),
          useClass: RepositoryMock,
        },
        {
          provide: getRepositoryToken(UserClient),
          useClass: RepositoryMock,
        },
        {
          provide: getRepositoryToken(ClientOnThirdParty),
          useClass: RepositoryMock,
        },
        {
          provide: MailsService,
          useClass: MailsServiceMock,
        },
        {
          provide: ConfigService,
          useClass: ConfigServiceMock,
        },
        {
          provide: AuthService,
          useClass: AuthServiceMock,
        },
        {
          provide: PointsConversionService,
          useClass: PointsConversionServiceMock,
        },
        {
          provide: PaymentsService,
          useClass: PaymentsServiceMock,
        },
        {
          provide: CsvService,
          useClass: CsvServiceMock,
        },
        {
          provide: TransactionService,
          useClass: TransactionServiceMock,
        },
        {
          provide: ThirdPartyInterestService,
          useClass: ThirdPartyInterestServiceMock,
        },
        {
          provide: UserClientService,
          useClass: UserClientServiceMock,
        },
        {
          provide: StateTransactionService,
          useClass: StateTransactionServiceMock,
        },
      ],
    }).compile();

    thirdPartyClientsService = module.get<ThirdPartyClientsService>(
      ThirdPartyClientsService,
    );
    thirdPartyClientsRepository = module.get(
      getRepositoryToken(ThirdPartyClient),
    );
    userClientRepository = module.get(getRepositoryToken(UserClient));
    clientOnThirdPartyRepository = module.get(
      getRepositoryToken(ClientOnThirdParty),
    );
    mailsService = module.get<MailsService>(MailsService);
    configService = module.get<ConfigService>(ConfigService);
    authService = module.get<AuthService>(AuthService);
    pointsConversionService = module.get<PointsConversionService>(
      PointsConversionService,
    );
    paymentsService = module.get<PaymentsService>(PaymentsService);
    csvService = module.get<CsvService>(CsvService);
    transactionService = module.get<TransactionService>(TransactionService);
    thirdPartyInterestService = module.get<ThirdPartyInterestService>(
      ThirdPartyInterestService,
    );
    userClientService = module.get<UserClientService>(UserClientService);
    stateTransactionService = module.get<StateTransactionService>(
      StateTransactionService,
    );
  });

  describe('get(apiKey)', () => {
    let expectedResult;
    let result;
    let apiKey: string;

    describe('case: success', () => {
      describe('when everything works well', () => {
        beforeEach(async () => {
          apiKey = 'prueba';
          expectedResult = {
            idThirdPartyClient: 1,
            name: 'prueba',
            apiKey,
            accumulatePercentage: 25,
          };

          (thirdPartyClientsRepository.findOne as jest.Mock).mockResolvedValue(
            expectedResult,
          );

          result = await thirdPartyClientsService.get(apiKey);
        });

        it('should invoke thirdPartyClientsRepository.findOne()', () => {
          expect(thirdPartyClientsRepository.findOne).toHaveBeenCalledTimes(1);
          expect(thirdPartyClientsRepository.findOne).toHaveBeenCalledWith({
            apiKey,
          });
        });

        it('should return a thirdPartyClient', () => {
          expect(result).toStrictEqual(expectedResult);
        });
      });
    });
  });

  describe('getAll()', () => {
    let expectedResult;
    let result;

    describe('case: success', () => {
      describe('when everything works well', () => {
        beforeEach(async () => {
          expectedResult = [
            {
              idThirdPartyClient: 1,
              name: 'prueba',
              apiKey: 'prueba',
              accumulatePercentage: 25,
            },
          ];

          (thirdPartyClientsRepository.find as jest.Mock).mockResolvedValue(
            expectedResult,
          );

          result = await thirdPartyClientsService.getAll();
        });

        it('should invoke thirdPartyClientsRepository.find()', () => {
          expect(thirdPartyClientsRepository.find).toHaveBeenCalledTimes(1);
        });

        it('should return an array of thirdPartyClient', () => {
          expect(result).toStrictEqual(expectedResult);
        });
      });
    });
  });

  describe('update(idThirdPartyClient, accumulatePercentage)', () => {
    let updateResult;
    let result;
    let idThirdPartyClient;
    let accumulatePercentage;

    describe('case: success', () => {
      describe('when everything works well', () => {
        beforeEach(async () => {
          idThirdPartyClient = 1;
          accumulatePercentage = 100;
          updateResult = new UpdateResult();

          (thirdPartyClientsRepository.update as jest.Mock).mockResolvedValue(
            updateResult,
          );

          result = await thirdPartyClientsService.update(
            idThirdPartyClient,
            accumulatePercentage,
          );
        });

        it('should invoke thirdPartyClientsRepository.update()', () => {
          expect(thirdPartyClientsRepository.update).toHaveBeenCalledTimes(1);
          expect(thirdPartyClientsRepository.update).toHaveBeenCalledWith(
            {
              idThirdPartyClient,
            },
            {
              accumulatePercentage,
            },
          );
        });

        it('should update a thirdPartyClient', () => {
          expect(result).toStrictEqual(updateResult);
        });
      });
    });
  });

  describe('associateUserCode(associateUserCodeRequest)', () => {
    let expectedResult;
    let result;
    let associateUserCodeRequest;
    let expectedThirdPartyClient;
    let expectedUserClient;
    let expectedClientOnThirdParty;

    describe('case: success', () => {
      describe('when everything works well', () => {
        beforeEach(async () => {
          associateUserCodeRequest = {
            apiKey: 'prueba',
            userEmail: 'pruebagmail.com',
          };

          expectedThirdPartyClient = {
            idThirdPartyClient: 1,
            name: 'prueba',
            apiKey: associateUserCodeRequest.apiKey,
            accumulatePercentage: 25,
          };
          expectedUserClient = {
            idUserClient: 1,
            email: associateUserCodeRequest.userEmail,
            userDetails: {
              firstName: 'Pedro',
              lastName: 'Perez',
              language: {
                idLanguage: 1,
                name: 'english',
                shortname: 'en',
              },
            },
          };
          expectedClientOnThirdParty = {
            idClientOnThirdParty: 1,
            code: 'prueba',
            expirationDate: new Date().setHours(new Date().getHours() + 1),
          };

          expectedResult = {
            request: associateUserCodeRequest,
            responseStatus: ThirdPartyClientResponseStatus.SUCCESSFUL,
          };

          (thirdPartyClientsRepository.findOne as jest.Mock).mockResolvedValue(
            expectedThirdPartyClient,
          );
          jest
            .spyOn(thirdPartyClientsService, 'get')
            .mockResolvedValue(expectedThirdPartyClient);

          (userClientRepository.findOne as jest.Mock).mockResolvedValue(
            expectedUserClient,
          );

          (clientOnThirdPartyRepository.findOne as jest.Mock).mockResolvedValue(
            expectedClientOnThirdParty,
          );
          (clientOnThirdPartyRepository.save as jest.Mock).mockResolvedValue(
            expectedClientOnThirdParty,
          );

          (mailsService.sendEmail as jest.Mock).mockResolvedValue(
            MailsResponse.SUCCESS,
          );

          result = await thirdPartyClientsService.associateUserCode(
            associateUserCodeRequest,
          );
        });

        it('should invoke userClientRepository.findOne()', () => {
          expect(userClientRepository.findOne).toHaveBeenCalledTimes(1);
          expect(userClientRepository.findOne).toHaveBeenCalledWith({
            email: associateUserCodeRequest.userEmail,
          });
        });

        it('should return an AssociateUserCodeResponse', () => {
          expect(result).toStrictEqual(expectedResult);
        });
      });
    });

    describe('case: failure', () => {
      let expectedError: BadRequestException;
      describe('when the user does not exist', () => {
        beforeEach(async () => {
          associateUserCodeRequest = {
            apiKey: 'prueba',
            userEmail: 'pruebagmail.com',
          };

          expectedThirdPartyClient = {
            idThirdPartyClient: 1,
            name: 'prueba',
            apiKey: associateUserCodeRequest.apiKey,
            accumulatePercentage: 25,
          };
          expectedUserClient = {};

          expectedError = new BadRequestException();

          (thirdPartyClientsRepository.findOne as jest.Mock).mockResolvedValue(
            expectedThirdPartyClient,
          );
          jest
            .spyOn(thirdPartyClientsService, 'get')
            .mockResolvedValue(expectedThirdPartyClient);

          (userClientRepository.findOne as jest.Mock).mockResolvedValue(
            expectedUserClient,
          );

          jest
            .spyOn(thirdPartyClientsService, 'associateUserCode')
            .mockRejectedValue(expectedError);
        });

        it('should throw when the user does not exist', async () => {
          await expect(
            thirdPartyClientsService.associateUserCode(
              associateUserCodeRequest,
            ),
          ).rejects.toThrow(BadRequestException);
        });
      });

      describe('when mailing fails', () => {
        beforeEach(async () => {
          associateUserCodeRequest = {
            apiKey: 'prueba',
            userEmail: 'pruebagmail.com',
          };

          expectedThirdPartyClient = {
            idThirdPartyClient: 1,
            name: 'prueba',
            apiKey: associateUserCodeRequest.apiKey,
            accumulatePercentage: 25,
          };
          expectedUserClient = {
            idUserClient: 1,
            email: associateUserCodeRequest.userEmail,
            userDetails: {
              firstName: 'Pedro',
              lastName: 'Perez',
              language: {
                idLanguage: 1,
                name: 'english',
                shortname: 'en',
              },
            },
          };
          expectedClientOnThirdParty = {
            idClientOnThirdParty: 1,
            code: 'prueba',
            expirationDate: new Date().setHours(new Date().getHours() + 1),
          };

          expectedResult = {
            request: associateUserCodeRequest,
            responseStatus: ThirdPartyClientResponseStatus.FAILD,
          };

          (thirdPartyClientsRepository.findOne as jest.Mock).mockResolvedValue(
            expectedThirdPartyClient,
          );
          jest
            .spyOn(thirdPartyClientsService, 'get')
            .mockResolvedValue(expectedThirdPartyClient);

          (userClientRepository.findOne as jest.Mock).mockResolvedValue(
            expectedUserClient,
          );

          (clientOnThirdPartyRepository.findOne as jest.Mock).mockResolvedValue(
            expectedClientOnThirdParty,
          );
          (clientOnThirdPartyRepository.save as jest.Mock).mockResolvedValue(
            expectedClientOnThirdParty,
          );

          (mailsService.sendEmail as jest.Mock).mockResolvedValue(
            MailsResponse.ERROR,
          );

          result = await thirdPartyClientsService.associateUserCode(
            associateUserCodeRequest,
          );
        });

        it('should invoke userClientRepository.findOne()', () => {
          expect(userClientRepository.findOne).toHaveBeenCalledTimes(1);
          expect(userClientRepository.findOne).toHaveBeenCalledWith({
            email: associateUserCodeRequest.userEmail,
          });
        });

        it('should return an AssociateUserCodeResponse', () => {
          expect(result).toStrictEqual(expectedResult);
        });
      });
    });
  });

  describe('associateUserToken(associateUserTokenRequest)', () => {
    let expectedResult;
    let result;
    let associateUserTokenRequest;
    let expectedThirdPartyClient;
    let expectedUserClient;
    let expectedClientOnThirdParty;
    let expectedToken;

    describe('case: success', () => {
      describe('when everything works well', () => {
        beforeEach(async () => {
          associateUserTokenRequest = {
            apiKey: 'prueba',
            userEmail: 'pruebagmail.com',
            userCode: 'prueba',
          };

          expectedThirdPartyClient = {
            idThirdPartyClient: 1,
            name: 'prueba',
            apiKey: associateUserTokenRequest.apiKey,
            accumulatePercentage: 25,
          };
          expectedUserClient = {
            idUserClient: 1,
            email: associateUserTokenRequest.userEmail,
          };
          expectedClientOnThirdParty = {
            idClientOnThirdParty: 1,
            code: 'prueba',
            expirationDate: new Date(),
            isCodeValid: userCode => ({ valid: true }),
          };
          expectedToken = 'prueba';

          expectedResult = {
            request: associateUserTokenRequest,
            userToken: expectedToken,
          };

          (thirdPartyClientsRepository.findOne as jest.Mock).mockResolvedValue(
            expectedThirdPartyClient,
          );
          jest
            .spyOn(thirdPartyClientsService, 'get')
            .mockResolvedValue(expectedThirdPartyClient);

          (userClientRepository.findOne as jest.Mock).mockResolvedValue(
            expectedUserClient,
          );

          (clientOnThirdPartyRepository.findOne as jest.Mock).mockResolvedValue(
            expectedClientOnThirdParty,
          );
          (clientOnThirdPartyRepository.save as jest.Mock).mockResolvedValue(
            expectedClientOnThirdParty,
          );

          (authService.createToken as jest.Mock).mockReturnValue(expectedToken);

          result = await thirdPartyClientsService.associateUserToken(
            associateUserTokenRequest,
          );
        });

        it('should invoke userClientRepository.findOne()', () => {
          expect(userClientRepository.findOne).toHaveBeenCalledTimes(1);
          expect(userClientRepository.findOne).toHaveBeenCalledWith({
            email: associateUserTokenRequest.userEmail,
          });
        });

        it('should invoke clientOnThirdPartyRepository.findOne()', () => {
          expect(clientOnThirdPartyRepository.findOne).toHaveBeenCalledTimes(1);
          expect(clientOnThirdPartyRepository.findOne).toHaveBeenCalledWith({
            userClient: expectedUserClient,
            thirdPartyClient: expectedThirdPartyClient,
          });
        });

        it('should invoke clientOnThirdPartyRepository.save()', () => {
          expect(clientOnThirdPartyRepository.save).toHaveBeenCalledTimes(1);
          expect(clientOnThirdPartyRepository.save).toHaveBeenCalledWith(
            expectedClientOnThirdParty,
          );
        });

        it('should invoke authService.createToken()', () => {
          expect(authService.createToken).toHaveBeenCalledTimes(1);
          expect(authService.createToken).toHaveBeenCalledWith(
            associateUserTokenRequest.userEmail,
            Role.THIRD_PARTY,
          );
        });

        it('should return an AssociateUserTokenResponse', () => {
          expect(result).toStrictEqual(expectedResult);
        });
      });
    });

    describe('case: failure', () => {
      let expectedError: BadRequestException;
      describe('when the user does not exist', () => {
        beforeEach(async () => {
          associateUserTokenRequest = {
            apiKey: 'prueba',
            userEmail: 'pruebagmail.com',
            userCode: 'prueba',
          };

          expectedThirdPartyClient = {
            idThirdPartyClient: 1,
            name: 'prueba',
            apiKey: associateUserTokenRequest.apiKey,
            accumulatePercentage: 25,
          };
          expectedUserClient = {};

          expectedError = new BadRequestException();

          (thirdPartyClientsRepository.findOne as jest.Mock).mockResolvedValue(
            expectedThirdPartyClient,
          );
          jest
            .spyOn(thirdPartyClientsService, 'get')
            .mockResolvedValue(expectedThirdPartyClient);

          (userClientRepository.findOne as jest.Mock).mockResolvedValue(
            expectedUserClient,
          );

          jest
            .spyOn(thirdPartyClientsService, 'associateUserToken')
            .mockRejectedValue(expectedError);
        });

        it('should throw when the user does not exist', async () => {
          await expect(
            thirdPartyClientsService.associateUserToken(
              associateUserTokenRequest,
            ),
          ).rejects.toThrow(BadRequestException);
        });
      });

      describe('when the clientOnThirdParty does not exist', () => {
        beforeEach(async () => {
          associateUserTokenRequest = {
            apiKey: 'prueba',
            userEmail: 'pruebagmail.com',
            userCode: 'prueba',
          };

          expectedThirdPartyClient = {
            idThirdPartyClient: 1,
            name: 'prueba',
            apiKey: associateUserTokenRequest.apiKey,
            accumulatePercentage: 25,
          };
          expectedUserClient = {
            idUserClient: 1,
            email: associateUserTokenRequest.userEmail,
          };
          expectedClientOnThirdParty = {};

          expectedError = new BadRequestException();

          (thirdPartyClientsRepository.findOne as jest.Mock).mockResolvedValue(
            expectedThirdPartyClient,
          );
          jest
            .spyOn(thirdPartyClientsService, 'get')
            .mockResolvedValue(expectedThirdPartyClient);

          (userClientRepository.findOne as jest.Mock).mockResolvedValue(
            expectedUserClient,
          );

          (clientOnThirdPartyRepository.findOne as jest.Mock).mockResolvedValue(
            expectedClientOnThirdParty,
          );

          jest
            .spyOn(thirdPartyClientsService, 'associateUserToken')
            .mockRejectedValue(expectedError);
        });

        it('should throw when clientOnThirdParty does not exist', async () => {
          await expect(
            thirdPartyClientsService.associateUserToken(
              associateUserTokenRequest,
            ),
          ).rejects.toThrow(BadRequestException);
        });
      });

      describe('when the code is not valid', () => {
        beforeEach(async () => {
          associateUserTokenRequest = {
            apiKey: 'prueba',
            userEmail: 'pruebagmail.com',
            userCode: 'prueba',
          };

          expectedThirdPartyClient = {
            idThirdPartyClient: 1,
            name: 'prueba',
            apiKey: associateUserTokenRequest.apiKey,
            accumulatePercentage: 25,
          };
          expectedUserClient = {
            idUserClient: 1,
            email: associateUserTokenRequest.userEmail,
          };
          expectedClientOnThirdParty = {
            idClientOnThirdParty: 1,
            code: 'prueba',
            expirationDate: new Date(),
            isCodeValid: userCode => ({ valid: false }),
          };

          expectedError = new BadRequestException();

          (thirdPartyClientsRepository.findOne as jest.Mock).mockResolvedValue(
            expectedThirdPartyClient,
          );
          jest
            .spyOn(thirdPartyClientsService, 'get')
            .mockResolvedValue(expectedThirdPartyClient);

          (userClientRepository.findOne as jest.Mock).mockResolvedValue(
            expectedUserClient,
          );

          (clientOnThirdPartyRepository.findOne as jest.Mock).mockResolvedValue(
            expectedClientOnThirdParty,
          );

          jest
            .spyOn(thirdPartyClientsService, 'associateUserToken')
            .mockRejectedValue(expectedError);
        });

        it('should throw when code is not valid', async () => {
          await expect(
            thirdPartyClientsService.associateUserToken(
              associateUserTokenRequest,
            ),
          ).rejects.toThrow(BadRequestException);
        });
      });
    });
  });

  describe('getClientOnThirdPartyByUserId(userClient, thirdPartyClient)', () => {
    let expectedResult;
    let result;
    let userClient;
    let thirdPartyClient;

    describe('case: success', () => {
      describe('when everything works well', () => {
        beforeEach(async () => {
          userClient = {
            idUserClient: 1,
            email: 'prueba@gmail.com',
          };
          thirdPartyClient = {
            idThirdPartyClient: 1,
            name: 'prueba',
            apiKey: 'prueba',
            accumulatePercentage: 25,
          };
          expectedResult = {
            idClientOnThirdParty: 1,
            code: 'prueba',
            expirationDate: new Date(),
          };

          (clientOnThirdPartyRepository.findOne as jest.Mock).mockResolvedValue(
            expectedResult,
          );

          result = await thirdPartyClientsService.getClientOnThirdPartyByUserId(
            userClient,
            thirdPartyClient,
          );
        });

        it('should invoke clientOnThirdPartyRepository.findOne()', () => {
          expect(clientOnThirdPartyRepository.findOne).toHaveBeenCalledTimes(1);
          expect(clientOnThirdPartyRepository.findOne).toHaveBeenCalledWith({
            userClient,
            thirdPartyClient,
          });
        });

        it('should return a clientOnThirdParty', () => {
          expect(result).toStrictEqual(expectedResult);
        });
      });
    });
  });

  describe('consultPoints(addPointsRequest, user)', () => {
    let expectedResult;
    let result;
    let addPointsRequest;
    let user;
    let expectedUserClient;
    let expectedOnePointToDollars;
    let expectedThirdPartyClient;
    let expectedInterests;
    let expectedTransactionInterest;
    let products;
    let commission;

    describe('case: success', () => {
      describe('when everything works well', () => {
        beforeEach(async () => {
          addPointsRequest = {
            apiKey: 'prueba',
            type: AddPointsRequestType.CONSULT,
            products: [
              {
                id: 1,
                priceTag: 10000,
                currency: 'usd',
              },
            ],
          };
          user = {
            id: 1,
            email: 'prueba@gmail.com',
          };
          expectedUserClient = {
            idUserClient: 1,
            email: 'prueba@gmail.com',
            userSuscription: [
              {
                idUserSuscription: 1,
                initialDate: new Date(),
                finalDate: null,
                suscription: {
                  idSuscription: 1,
                  name: 'BASIC',
                },
              },
            ],
          };
          expectedOnePointToDollars = {
            idPointsConversion: 1,
            onePointEqualsDollars: 0.002,
            initialDate: new Date(),
            finalDate: null,
          };
          expectedThirdPartyClient = {
            idThirdPartyClient: 1,
            name: 'prueba',
            apiKey: addPointsRequest.apiKey,
            accumulatePercentage: 0.25,
          };
          expectedInterests = [
            {
              operation: 1,
              amount: 75,
              percentage: 0,
            },
            { operation: 1, amount: 0, percentage: 0.06 },
          ];
          expectedTransactionInterest = {
            interest: {
              idPlatformInterest: 1,
              name: 'withdrawal',
              amount: 0,
              percentage: 0.06,
            },
            extraPoints: null,
            pointsConversion: expectedOnePointToDollars,
            thirdPartyInterest: {
              idThirdPartyInterest: 1,
              transactionType: 'withdrawal',
              paymentProvider: 'STRIPE',
              operation: 1,
              amount: 75,
              percentage: 0,
            },
          };
          products = [
            {
              id: 1,
              priceTag: 10000,
              currency: 'usd',
              tentativePoints: 12500,
            },
          ];
          commission = 225;

          expectedResult = {
            request: {
              ...addPointsRequest,
              products,
              totalTentativeCommission: commission,
            },
            confirmationTicket: null,
          };

          (userClientService.get as jest.Mock).mockResolvedValue(
            expectedUserClient,
          );
          (pointsConversionService.getRecentPointsConversion as jest.Mock).mockResolvedValue(
            expectedOnePointToDollars,
          );

          (thirdPartyClientsRepository.findOne as jest.Mock).mockResolvedValue(
            expectedThirdPartyClient,
          );
          jest
            .spyOn(thirdPartyClientsService, 'get')
            .mockResolvedValue(expectedThirdPartyClient);

          (paymentsService.getInterests as jest.Mock).mockResolvedValue(
            expectedInterests,
          );
          (transactionService.getTransactionInterests as jest.Mock).mockResolvedValue(
            expectedTransactionInterest,
          );

          result = await thirdPartyClientsService.consultPoints(
            addPointsRequest,
            user,
          );
        });

        it('should invoke userClientService.get()', () => {
          expect(userClientService.get).toHaveBeenCalledTimes(1);
          expect(userClientService.get).toHaveBeenCalledWith({
            email: user.email,
            idUserClient: user.id,
          });
        });

        it('should invoke pointsConversionService.getRecentPointsConversion()', () => {
          expect(
            pointsConversionService.getRecentPointsConversion,
          ).toHaveBeenCalledTimes(1);
        });

        it('should invoke paymentsService.getInterests()', () => {
          expect(paymentsService.getInterests).toHaveBeenCalledTimes(1);
          expect(paymentsService.getInterests).toHaveBeenCalledWith(
            TransactionType.WITHDRAWAL,
            PlatformInterest.WITHDRAWAL,
          );
        });

        it('should return an AddPointsResponse of a CONSULT', () => {
          expect(result).toStrictEqual(expectedResult);
        });
      });
    });
  });

  describe('createTransaction(addPointsRequest, user)', () => {
    let expectedResult;
    let result;
    let addPointsRequest;
    let user;
    let expectedUserClient;
    let expectedOnePointToDollars;
    let expectedThirdPartyClient;
    let expectedInterests;
    let expectedTransactionInterest;
    let products;
    let commission;
    let expectedConsultPoints;
    let expectedClientOnThirdParty;
    let expectedThirdPartyInterest;
    let expectedTransaction;
    let confirmationTicket;
    let options;

    describe('case: success', () => {
      describe('when everything works well', () => {
        beforeEach(async () => {
          addPointsRequest = {
            apiKey: 'prueba',
            type: AddPointsRequestType.CREATION,
            products: [
              {
                id: 1,
                priceTag: 10000,
                currency: 'usd',
              },
            ],
          };
          user = {
            id: 1,
            email: 'prueba@gmail.com',
          };
          expectedUserClient = {
            idUserClient: 1,
            email: 'prueba@gmail.com',
            userSuscription: [
              {
                idUserSuscription: 1,
                initialDate: new Date(),
                finalDate: null,
                suscription: {
                  idSuscription: 1,
                  name: 'BASIC',
                },
              },
            ],
          };
          expectedOnePointToDollars = {
            idPointsConversion: 1,
            onePointEqualsDollars: 0.002,
            initialDate: new Date(),
            finalDate: null,
          };
          expectedThirdPartyClient = {
            idThirdPartyClient: 1,
            name: 'prueba',
            apiKey: addPointsRequest.apiKey,
            accumulatePercentage: 0.25,
          };
          expectedInterests = [
            {
              operation: 1,
              amount: 75,
              percentage: 0,
            },
            { operation: 1, amount: 0, percentage: 0.06 },
          ];
          expectedTransactionInterest = {
            interest: {
              idPlatformInterest: 1,
              name: 'withdrawal',
              amount: 0,
              percentage: 0.06,
            },
            extraPoints: null,
            pointsConversion: expectedOnePointToDollars,
            thirdPartyInterest: {
              idThirdPartyInterest: 1,
              transactionType: 'withdrawal',
              paymentProvider: 'STRIPE',
              operation: 1,
              amount: 75,
              percentage: 0,
            },
          };
          products = [
            {
              id: 1,
              priceTag: 10000,
              currency: 'usd',
              tentativePoints: 12500,
            },
          ];
          commission = 225;
          expectedConsultPoints = {
            request: {
              ...addPointsRequest,
              products,
              totalTentativeCommission: commission,
            },
            confirmationTicket: null,
          };
          expectedClientOnThirdParty = {
            idClientOnThirdParty: 1,
            code: 'prueba',
            expirationDate: new Date(),
          };
          expectedThirdPartyInterest = {
            operation: 1,
            amount: 75,
            percentage: 0,
          };
          expectedTransaction = {
            idTransaction: 1,
            initialDate: new Date(),
          };
          options = {
            clientOnThirdParty: expectedClientOnThirdParty,
            totalAmountWithInterest: commission,
            rawAmount: 2500,
            type: TransactionType.THIRD_PARTY_CLIENT,
            pointsConversion: expectedTransactionInterest.pointsConversion,
            platformInterest: expectedTransactionInterest.interest,
            thirdPartyInterest: expectedThirdPartyInterest,
            platformInterestExtraPoints:
              expectedTransactionInterest.extraPoints,
            stateTransactionDescription:
              StateDescription.THIRD_PARTY_CLIENT_TRANSACTION,
            operation: 1,
          };
          confirmationTicket = {
            confirmationId: expectedTransaction.idTransaction.toString(),
            userEmail: user.email,
            date: expectedTransaction.initialDate.toISOString(),
            currency: addPointsRequest.products[0].currency,
            pointsToDollars: 2500,
            accumulatedPoints: 12500,
            commission: commission,
            status: StateName.VERIFYING,
          };
          expectedResult = {
            request: expectedConsultPoints.request,
            confirmationTicket: confirmationTicket,
          };

          (userClientService.get as jest.Mock).mockResolvedValue(
            expectedUserClient,
          );
          (pointsConversionService.getRecentPointsConversion as jest.Mock).mockResolvedValue(
            expectedOnePointToDollars,
          );

          (thirdPartyClientsRepository.findOne as jest.Mock).mockResolvedValue(
            expectedThirdPartyClient,
          );
          jest
            .spyOn(thirdPartyClientsService, 'get')
            .mockResolvedValue(expectedThirdPartyClient);

          (paymentsService.getInterests as jest.Mock).mockResolvedValue(
            expectedInterests,
          );
          (transactionService.getTransactionInterests as jest.Mock).mockResolvedValue(
            expectedTransactionInterest,
          );

          jest
            .spyOn(thirdPartyClientsService, 'consultPoints')
            .mockResolvedValue(expectedConsultPoints);

          (clientOnThirdPartyRepository.findOne as jest.Mock).mockResolvedValue(
            expectedClientOnThirdParty,
          );
          jest
            .spyOn(thirdPartyClientsService, 'getClientOnThirdPartyByUserId')
            .mockResolvedValue(expectedClientOnThirdParty);

          (thirdPartyInterestService.get as jest.Mock).mockResolvedValue(
            expectedThirdPartyInterest,
          );

          result = await thirdPartyClientsService.createTransaction(
            addPointsRequest,
            user,
          );
        });

        it('should invoke userClientService.get()', () => {
          expect(userClientService.get).toHaveBeenCalledTimes(1);
          expect(userClientService.get).toHaveBeenCalledWith({
            email: user.email,
            idUserClient: user.id,
          });
        });

        it('should invoke pointsConversionService.getRecentPointsConversion()', () => {
          expect(
            pointsConversionService.getRecentPointsConversion,
          ).toHaveBeenCalledTimes(1);
        });

        it('should invoke thirdPartyInterestService.get()', () => {
          expect(thirdPartyInterestService.get).toHaveBeenCalledTimes(1);
          expect(thirdPartyInterestService.get).toHaveBeenCalledWith(
            PaymentProvider.STRIPE,
            TransactionType.WITHDRAWAL,
          );
        });

        it('should invoke paymentsService.getInterests()', () => {
          expect(paymentsService.getInterests).toHaveBeenCalledTimes(1);
          expect(paymentsService.getInterests).toHaveBeenCalledWith(
            TransactionType.WITHDRAWAL,
            PlatformInterest.WITHDRAWAL,
          );
        });

        it('should invoke transactionService.createTransaction()', () => {
          expect(transactionService.createTransaction).toHaveBeenCalledTimes(1);
          expect(transactionService.createTransaction).toHaveBeenCalledWith(
            options,
            StateName.VERIFYING,
          );
        });

        it('should return an AddPointsResponse of a CREATION', () => {
          expect(result).toStrictEqual(expectedResult);
        });
      });
    });
  });
});
