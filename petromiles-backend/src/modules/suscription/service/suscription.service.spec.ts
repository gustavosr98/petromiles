import { MailsSubjets } from '@/constants/mailsSubjectConst';
import { PlatformInterest } from '@/enums/platform-interest.enum';
import { Transaction } from '@/entities/transaction.entity';
import { PaymentProvider } from '@/enums/payment-provider.enum';
import { StateName, StateDescription } from '@/enums/state.enum';
import { TransactionType } from '@/enums/transaction.enum';
import { UserSuscription } from '@/entities/user-suscription.entity';
import { ClientBankAccountService } from '@/modules/bank-account/services/client-bank-account.service';
import { StateTransaction } from '@/entities/state-transaction.entity';
import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { ConfigService } from '@nestjs/config';

import { SuscriptionService } from '@/modules/suscription/service/suscription.service';
import { PaymentProviderService } from '@/modules/payment-provider/payment-provider.service';
import { TransactionService } from '@/modules/transaction/services/transaction.service';
import { PointsConversionService } from '@/modules/management/services/points-conversion.service';
import { ThirdPartyInterestService } from '@/modules/management/services/third-party-interest.service';
import { PlatformInterestService } from '@/modules/management/services/platform-interest.service';
import { UserClientService } from '@/modules/user/services/user-client.service';
import { MailsService } from '@/modules/mails/mails.service';

import { PlatformInterest as PlatformInterestEntity } from '@/entities/platform-interest.entity';
import { Suscription } from '@/entities/suscription.entity';

import { Suscription as SuscriptionType } from '@/enums/suscription.enum';

import { WinstonModule } from 'nest-winston';
import createOptions from '../../../logger/winston/winston-config';

describe('SuscriptionService', () => {
  let suscriptionService: SuscriptionService;
  let RepositoryMock: jest.Mock;
  let suscriptionRepository: Repository<Suscription>;
  let platformInterestRepository: Repository<PlatformInterestEntity>;
  let stateTransactionRepository: Repository<StateTransaction>;
  let userSuscriptionRepository: Repository<UserSuscription>;
  let transactionRepository: Repository<Transaction>;
  let UserClientServiceMock: jest.Mock<Partial<UserClientService>>;
  let userClientService: UserClientService;
  let ClientBankAccountServiceMock: jest.Mock<Partial<
    ClientBankAccountService
  >>;
  let clientBankAccountService: ClientBankAccountService;
  let TransactionServiceMock: jest.Mock<Partial<TransactionService>>;
  let transactionService: TransactionService;
  let PointsConversionServiceMock: jest.Mock<Partial<PointsConversionService>>;
  let pointsConversionService: PointsConversionService;
  let PlatformInterestServiceMock: jest.Mock<Partial<PlatformInterestService>>;
  let platformInterestService: PlatformInterestService;
  let MailsServiceMock: jest.Mock<Partial<MailsService>>;
  let mailsService: MailsService;
  let ConfigServiceMock: jest.Mock<Partial<ConfigService>>;
  let configService: ConfigService;
  let PaymentProviderServiceMock: jest.Mock<Partial<PaymentProviderService>>;
  let paymentProviderService: PaymentProviderService;
  let ThirdPartyInterestServiceMock: jest.Mock<Partial<
    ThirdPartyInterestService
  >>;
  let thirdPartyInterestService: ThirdPartyInterestService;
  let save: jest.Mock;
  let getRawOne: jest.Mock;
  let getOne: jest.Mock;
  let execute: jest.Mock;

  beforeEach(() => {
    let select = jest.fn().mockReturnThis();
    let leftJoin = jest.fn().mockReturnThis();
    let where = jest.fn().mockReturnThis();
    let andWhere = jest.fn().mockReturnThis();
    let innerJoin = jest.fn().mockReturnThis();
    let update = jest.fn().mockReturnThis();
    let set = jest.fn().mockReturnThis();
    let create = jest.fn().mockReturnThis();
    save = jest.fn().mockReturnThis();
    getRawOne = jest.fn().mockReturnThis();
    getOne = jest.fn().mockReturnThis();
    execute = jest.fn().mockReturnThis();
    RepositoryMock = jest.fn(() => ({
      find: jest.fn(),
      findOne: jest.fn(),
      save,
      update: jest.fn(),
      delete: jest.fn(),
      create,
      createQueryBuilder: jest.fn(() => ({
        select,
        leftJoin,
        where,
        andWhere,
        innerJoin,
        update,
        set,
        getRawOne,
        getOne,
        execute,
      })),
    }));
    UserClientServiceMock = jest.fn<
      Partial<UserClientService>,
      UserClientService[]
    >(() => ({
      get: jest.fn(),
    }));
    ClientBankAccountServiceMock = jest.fn<
      Partial<ClientBankAccountService>,
      ClientBankAccountService[]
    >(() => ({
      getOne: jest.fn(),
    }));
    TransactionServiceMock = jest.fn<
      Partial<TransactionService>,
      TransactionService[]
    >(() => ({
      createUpgradeSuscriptionTransaction: jest.fn(),
    }));
    PointsConversionServiceMock = jest.fn<
      Partial<PointsConversionService>,
      PointsConversionService[]
    >(() => ({
      getRecentPointsConversion: jest.fn(),
    }));
    PlatformInterestServiceMock = jest.fn<
      Partial<PlatformInterestService>,
      PlatformInterestService[]
    >(() => ({
      getInterestByName: jest.fn(),
    }));
    MailsServiceMock = jest.fn<Partial<MailsService>, MailsService[]>(() => ({
      sendEmail: jest.fn(),
    }));
    ConfigServiceMock = jest.fn<Partial<ConfigService>, ConfigService[]>(
      () => ({
        get: jest.fn(),
      }),
    );
    PaymentProviderServiceMock = jest.fn<
      Partial<PaymentProviderService>,
      PaymentProviderService[]
    >(() => ({
      createCharge: jest.fn(),
    }));
    ThirdPartyInterestServiceMock = jest.fn<
      Partial<ThirdPartyInterestService>,
      ThirdPartyInterestService[]
    >(() => ({
      getCurrentInterest: jest.fn(),
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
        SuscriptionService,
        {
          provide: getRepositoryToken(Suscription),
          useClass: RepositoryMock,
        },
        {
          provide: getRepositoryToken(PlatformInterestEntity),
          useClass: RepositoryMock,
        },
        {
          provide: getRepositoryToken(StateTransaction),
          useClass: RepositoryMock,
        },
        {
          provide: getRepositoryToken(UserSuscription),
          useClass: RepositoryMock,
        },
        {
          provide: getRepositoryToken(Transaction),
          useClass: RepositoryMock,
        },
        {
          provide: UserClientService,
          useClass: UserClientServiceMock,
        },
        {
          provide: ClientBankAccountService,
          useClass: ClientBankAccountServiceMock,
        },
        {
          provide: TransactionService,
          useClass: TransactionServiceMock,
        },
        {
          provide: PointsConversionService,
          useClass: PointsConversionServiceMock,
        },
        {
          provide: PlatformInterestService,
          useClass: PlatformInterestServiceMock,
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
          provide: PaymentProviderService,
          useClass: PaymentProviderServiceMock,
        },
        {
          provide: ThirdPartyInterestService,
          useClass: ThirdPartyInterestServiceMock,
        },
      ],
    }).compile();

    suscriptionService = module.get<SuscriptionService>(SuscriptionService);
    suscriptionRepository = module.get(getRepositoryToken(Suscription));
    platformInterestRepository = module.get(
      getRepositoryToken(PlatformInterestEntity),
    );
    stateTransactionRepository = module.get(
      getRepositoryToken(StateTransaction),
    );
    userSuscriptionRepository = module.get(getRepositoryToken(UserSuscription));
    transactionRepository = module.get(getRepositoryToken(Transaction));
    userClientService = module.get<UserClientService>(UserClientService);
    clientBankAccountService = module.get<ClientBankAccountService>(
      ClientBankAccountService,
    );
    transactionService = module.get<TransactionService>(TransactionService);
    pointsConversionService = module.get<PointsConversionService>(
      PointsConversionService,
    );
    platformInterestService = module.get<PlatformInterestService>(
      PlatformInterestService,
    );
    mailsService = module.get<MailsService>(MailsService);
    configService = module.get<ConfigService>(ConfigService);
    paymentProviderService = module.get<PaymentProviderService>(
      PaymentProviderService,
    );
    thirdPartyInterestService = module.get<ThirdPartyInterestService>(
      ThirdPartyInterestService,
    );
  });

  describe('get(suscriptionType)', () => {
    let expectedResult;
    let result;
    let suscriptionType: SuscriptionType;

    describe('case: success', () => {
      describe('when everything works well', () => {
        beforeEach(async () => {
          suscriptionType = SuscriptionType.BASIC;
          expectedResult = {
            idSuscription: 1,
            name: 'basic',
            cost: 0,
          };

          (suscriptionRepository.findOne as jest.Mock).mockResolvedValue(
            expectedResult,
          );

          result = await suscriptionService.get(suscriptionType);
        });

        it('should invoke suscriptionRepository.findOne()', () => {
          expect(suscriptionRepository.findOne).toHaveBeenCalledTimes(1);
          expect(suscriptionRepository.findOne).toHaveBeenCalledWith({
            name: suscriptionType,
          });
        });

        it('should return a suscription', () => {
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
              idSuscription: 1,
              name: 'basic',
              cost: 0,
            },
          ];

          (suscriptionRepository.find as jest.Mock).mockResolvedValue(
            expectedResult,
          );

          result = await suscriptionService.getAll();
        });

        it('should invoke suscriptionRepository.find()', () => {
          expect(suscriptionRepository.find).toHaveBeenCalledTimes(1);
        });

        it('should return an array of suscriptions', () => {
          expect(result).toStrictEqual(expectedResult);
        });
      });
    });
  });

  describe('getUserSuscription(userClient)', () => {
    let expectedResult;
    let result;
    let userClient;

    describe('case: success', () => {
      describe('when everything works well', () => {
        beforeEach(async () => {
          userClient = {
            idUserClient: 1,
            email: 'prueba@gmail.com',
          };
          expectedResult = {
            idUserSuscription: 1,
            initialDate: new Date(),
            finalDate: null,
          };

          (userSuscriptionRepository.findOne as jest.Mock).mockResolvedValue(
            expectedResult,
          );

          result = await suscriptionService.getUserSuscription(userClient);
        });

        it('should invoke userSuscriptionRepository.findOne()', () => {
          expect(userSuscriptionRepository.findOne).toHaveBeenCalledTimes(1);
          expect(userSuscriptionRepository.findOne).toHaveBeenCalledWith({
            userClient,
            finalDate: null,
          });
        });

        it('should return an user suscription', () => {
          expect(result).toStrictEqual(expectedResult);
        });
      });
    });
  });

  describe('createUserSuscription(userClient, suscriptionType, transaction)', () => {
    let expectedResult;
    let result;
    let userClient;
    let suscriptionType;
    let transaction;
    let expectedSuscription;

    describe('case: success', () => {
      describe('when everything works well', () => {
        beforeEach(async () => {
          userClient = {
            idUserClient: 1,
            email: 'prueba@gmail.com',
          };
          suscriptionType = SuscriptionType.BASIC;
          transaction = {
            idTransaction: 1,
            totalAmountWithInterest: 77,
            rawAmount: 524,
            type: TransactionType.DEPOSIT,
            clientBankAccount: {
              idClientBankAccount: 1,
            },
            paymentProviderTransactionId: null,
            stateTransaction: [
              {
                idStateTransaction: 1,
                finalDate: null,
              },
            ],
          };

          expectedSuscription = {
            idSuscription: 1,
            name: 'basic',
            cost: 0,
          };

          expectedResult = {
            idUserSuscription: 1,
            initialDate: new Date(),
            finalDate: null,
          };

          (suscriptionRepository.findOne as jest.Mock).mockResolvedValue(
            expectedSuscription,
          );
          jest
            .spyOn(suscriptionService, 'get')
            .mockResolvedValue(expectedSuscription);

          save.mockResolvedValue(expectedResult);

          result = await suscriptionService.createUserSuscription(
            userClient,
            suscriptionType,
            transaction,
          );
        });

        it('should invoke userSuscriptionRepository.save()', () => {
          expect(save).toHaveBeenCalledTimes(1);
          expect(userSuscriptionRepository.create).toHaveBeenCalledWith({
            userClient,
            suscription: expectedSuscription,
            transaction,
            upgradedAmount: expectedSuscription.cost,
          });
        });

        it('should return a new user suscription', () => {
          expect(result).toStrictEqual(expectedResult);
        });
      });
    });
  });

  describe('hasPendingUpgrade(iduserClient)', () => {
    let expectedResult;
    let result;
    let iduserClient;
    let expectedStatus;

    describe('case: success', () => {
      describe('when the user have pending transactions', () => {
        beforeEach(async () => {
          iduserClient = 1;

          expectedStatus = {
            s_name: StateName.VERIFYING,
          };

          expectedResult = true;

          getRawOne.mockResolvedValue(expectedStatus);

          result = await suscriptionService.hasPendingUpgrade(iduserClient);
        });

        it('should invoke stateTransactionRepository.createQueryBuilder()', () => {
          expect(getRawOne).toHaveBeenCalledTimes(1);
        });

        it('should return a status - boolean', () => {
          expect(result).toStrictEqual(expectedResult);
        });
      });

      describe('when the user does not have pending transactions', () => {
        beforeEach(async () => {
          iduserClient = 1;

          expectedStatus = undefined;

          expectedResult = false;

          getRawOne.mockResolvedValue(expectedStatus);

          result = await suscriptionService.hasPendingUpgrade(iduserClient);
        });

        it('should invoke stateTransactionRepository.createQueryBuilder()', () => {
          expect(getRawOne).toHaveBeenCalledTimes(1);
        });

        it('should return a status - boolean', () => {
          expect(result).toStrictEqual(expectedResult);
        });
      });
    });
  });

  describe('upgradeToPremium(email, idBankAccount, costSuscription)', () => {
    let result;
    let email;
    let idBankAccount;
    let costSuscription;
    let expectedSuscription;
    let expectedUserClient;
    let expectedThirdPartyInterest;
    let expectedClientBankAccount;
    let expectedUserSuscription;
    let expectedCharge;
    let expectedTransaction;

    describe('case: success', () => {
      describe('when everything works well', () => {
        beforeEach(async () => {
          email = 'prueba@gmail.com';
          idBankAccount = 1;
          costSuscription = 100;

          expectedUserClient = {
            idUserClient: 1,
            email,
          };
          expectedSuscription = {
            idSuscription: 1,
            name: 'premium',
            cost: 100,
          };
          expectedThirdPartyInterest = { amountDollarCents: 75, percentage: 0 };
          expectedClientBankAccount = {
            idClientBankAccount: 1,
            paymentProvider: 'STRIPE',
            chargeId: 'prueba',
            primary: false,
            transferId: 'prueba',
            userClient: {
              idUserClient: 1,
              email: 'prueba@gmail.com',
              userDetails: [
                {
                  idUserDetails: 1,
                  firstName: 'Pedro',
                  lastName: 'Perez',
                  customerId: 'prueba',
                  accountId: 'prueba',
                  accountOwner: null,
                },
              ],
              userSuscription: [
                {
                  idUserSuscription: 3,
                  initialDate: new Date(),
                  upgradedAmount: 0,
                  finalDate: null,
                  suscription: {
                    idSuscription: 1,
                    name: 'basic',
                    cost: 0,
                  },
                },
              ],
            },
            bankAccount: {
              idBankAccount: 1,
              accountNumber: '1',
              checkNumber: '1111',
              nickname: 'prueba',
              type: 'Saving',
              routingNumber: {
                idRoutingNumber: 1,
                number: '1',
              },
            },
          };
          expectedUserSuscription = {
            idUserSuscription: 1,
            initialDate: new Date(),
            finalDate: null,
            suscription: {
              name: 'BASIC',
            },
          };
          expectedCharge = {
            id: 'prueba',
            object: 'charge',
            amount: 100,
            source: 'prueba',
            customer: 'prueba',
            currency: 'usd',
          };
          expectedTransaction = {
            totalAmountWithInterest: 100,
            rawAmount: 0,
            type: TransactionType.SUSCRIPTION_PAYMENT,
            stateTransactionDescription: StateDescription.SUSCRIPTION_UPGRADE,
            thirdPartyInterest: expectedThirdPartyInterest,
            promotion: null,
            platformInterestExtraPoints: null,
          };

          (userClientService.get as jest.Mock).mockResolvedValue(
            expectedUserClient,
          );

          (suscriptionRepository.findOne as jest.Mock).mockResolvedValue(
            expectedSuscription,
          );
          jest
            .spyOn(suscriptionService, 'get')
            .mockResolvedValue(expectedSuscription);

          (thirdPartyInterestService.getCurrentInterest as jest.Mock).mockResolvedValue(
            expectedThirdPartyInterest,
          );
          (clientBankAccountService.getOne as jest.Mock).mockResolvedValue(
            expectedClientBankAccount,
          );

          getRawOne.mockResolvedValue(undefined);
          jest
            .spyOn(suscriptionService, 'hasPendingUpgrade')
            .mockResolvedValue(false);

          (userSuscriptionRepository.findOne as jest.Mock).mockResolvedValue(
            expectedUserSuscription,
          );
          jest
            .spyOn(suscriptionService, 'getUserSuscription')
            .mockResolvedValue(expectedUserSuscription);

          (paymentProviderService.createCharge as jest.Mock).mockResolvedValue(
            expectedCharge,
          );
          (transactionService.createUpgradeSuscriptionTransaction as jest.Mock).mockResolvedValue(
            expectedTransaction,
          );

          result = await suscriptionService.upgradeToPremium(
            email,
            idBankAccount,
            costSuscription,
          );
        });

        it('should invoke userClientService.get()', () => {
          expect(userClientService.get).toHaveBeenCalledTimes(1);
          expect(userClientService.get).toHaveBeenCalledWith({ email });
        });
        it('should invoke thirdPartyInterestService.getCurrentInterest()', () => {
          expect(
            thirdPartyInterestService.getCurrentInterest,
          ).toHaveBeenCalledTimes(1);
          expect(
            thirdPartyInterestService.getCurrentInterest,
          ).toHaveBeenCalledWith(
            PaymentProvider.STRIPE,
            TransactionType.DEPOSIT,
          );
        });
        it('should invoke clientBankAccountService.getOne()', () => {
          expect(clientBankAccountService.getOne).toHaveBeenCalledTimes(1);
          expect(clientBankAccountService.getOne).toHaveBeenCalledWith(
            expectedUserClient.idUserClient,
            idBankAccount,
          );
        });
        it('should invoke paymentProviderService.createCharge()', () => {
          expect(paymentProviderService.createCharge).toHaveBeenCalledTimes(1);
          expect(paymentProviderService.createCharge).toHaveBeenCalledWith({
            customer:
              expectedClientBankAccount.userClient.userDetails[0].customerId,
            source: expectedClientBankAccount.chargeId,
            currency: 'usd',
            amount: Math.trunc(
              expectedSuscription.cost +
                expectedThirdPartyInterest.amountDollarCents,
            ),
          });
        });
        it('should invoke transactionService.createUpgradeSuscriptionTransaction()', () => {
          expect(
            transactionService.createUpgradeSuscriptionTransaction,
          ).toHaveBeenCalledTimes(1);
          expect(
            transactionService.createUpgradeSuscriptionTransaction,
          ).toHaveBeenCalledWith(
            expectedClientBankAccount,
            expectedSuscription,
            expectedCharge.id,
          );
        });

        it('should return a transaction', () => {
          expect(result).toStrictEqual(expectedTransaction);
        });
      });
    });

    describe('case: failure', () => {
      let expectedError: BadRequestException;
      describe('when the cost is incorrect', () => {
        beforeEach(async () => {
          email = 'prueba@gmail.com';
          idBankAccount = 1;
          costSuscription = 200;

          expectedUserClient = {
            idUserClient: 1,
            email,
          };
          expectedSuscription = {
            idSuscription: 1,
            name: 'premium',
            cost: 100,
          };
          expectedThirdPartyInterest = { amountDollarCents: 75, percentage: 0 };

          (userClientService.get as jest.Mock).mockResolvedValue(
            expectedUserClient,
          );

          (suscriptionRepository.findOne as jest.Mock).mockResolvedValue(
            expectedSuscription,
          );
          jest
            .spyOn(suscriptionService, 'get')
            .mockResolvedValue(expectedSuscription);

          (thirdPartyInterestService.getCurrentInterest as jest.Mock).mockResolvedValue(
            expectedThirdPartyInterest,
          );

          expectedError = new BadRequestException();

          jest
            .spyOn(suscriptionService, 'upgradeToPremium')
            .mockRejectedValue(expectedError);
        });
        it('should throw when the cost is incorrect', async () => {
          await expect(
            suscriptionService.upgradeToPremium(
              email,
              idBankAccount,
              costSuscription,
            ),
          ).rejects.toThrow(BadRequestException);
        });

        it('should not invoke clientBankAccountService.getOne()', () => {
          expect(clientBankAccountService.getOne).not.toHaveBeenCalled();
        });
        it('should not invoke paymentProviderService.createCharge()', () => {
          expect(paymentProviderService.createCharge).not.toHaveBeenCalled();
        });
        it('should not invoke transactionService.createUpgradeSuscriptionTransaction()', () => {
          expect(
            transactionService.createUpgradeSuscriptionTransaction,
          ).not.toHaveBeenCalled();
        });
      });

      describe('when the user has pending transactions', () => {
        let expectedStatus;
        beforeEach(async () => {
          email = 'prueba@gmail.com';
          idBankAccount = 1;
          costSuscription = 200;

          expectedUserClient = {
            idUserClient: 1,
            email,
          };
          expectedSuscription = {
            idSuscription: 1,
            name: 'premium',
            cost: 100,
          };
          expectedThirdPartyInterest = { amountDollarCents: 75, percentage: 0 };
          expectedClientBankAccount = {
            idClientBankAccount: 1,
            chargeId: 'prueba',
            primary: false,
            transferId: 'prueba',
            userClient: {
              idUserClient: 1,
              email: 'prueba@gmail.com',
              userDetails: [
                {
                  idUserDetails: 1,
                  firstName: 'Pedro',
                  lastName: 'Perez',
                  customerId: 'prueba',
                  accountId: 'prueba',
                  accountOwner: null,
                },
              ],
            },
          };
          expectedStatus = {
            s_name: StateName.VERIFYING,
          };

          (userClientService.get as jest.Mock).mockResolvedValue(
            expectedUserClient,
          );

          (suscriptionRepository.findOne as jest.Mock).mockResolvedValue(
            expectedSuscription,
          );
          jest
            .spyOn(suscriptionService, 'get')
            .mockResolvedValue(expectedSuscription);

          (thirdPartyInterestService.getCurrentInterest as jest.Mock).mockResolvedValue(
            expectedThirdPartyInterest,
          );
          (clientBankAccountService.getOne as jest.Mock).mockResolvedValue(
            expectedClientBankAccount,
          );

          getRawOne.mockResolvedValue(expectedStatus);
          jest
            .spyOn(suscriptionService, 'hasPendingUpgrade')
            .mockResolvedValue(true);

          expectedError = new BadRequestException();

          jest
            .spyOn(suscriptionService, 'upgradeToPremium')
            .mockRejectedValue(expectedError);
        });
        it('should throw when the user has pending transactions', async () => {
          await expect(
            suscriptionService.upgradeToPremium(
              email,
              idBankAccount,
              costSuscription,
            ),
          ).rejects.toThrow(BadRequestException);
        });

        it('should not invoke paymentProviderService.createCharge()', () => {
          expect(paymentProviderService.createCharge).not.toHaveBeenCalled();
        });
        it('should not invoke transactionService.createUpgradeSuscriptionTransaction()', () => {
          expect(
            transactionService.createUpgradeSuscriptionTransaction,
          ).not.toHaveBeenCalled();
        });
      });

      describe('when the user already has a suscription premium or gold', () => {
        beforeEach(async () => {
          email = 'prueba@gmail.com';
          idBankAccount = 1;
          costSuscription = 200;

          expectedUserClient = {
            idUserClient: 1,
            email,
          };
          expectedSuscription = {
            idSuscription: 1,
            name: 'premium',
            cost: 100,
          };
          expectedThirdPartyInterest = { amountDollarCents: 75, percentage: 0 };
          expectedClientBankAccount = {
            idClientBankAccount: 1,
            chargeId: 'prueba',
            primary: false,
            transferId: 'prueba',
            userClient: {
              idUserClient: 1,
              email: 'prueba@gmail.com',
              userDetails: [
                {
                  idUserDetails: 1,
                  firstName: 'Pedro',
                  lastName: 'Perez',
                  customerId: 'prueba',
                  accountId: 'prueba',
                  accountOwner: null,
                },
              ],
            },
          };
          expectedUserSuscription = {
            idUserSuscription: 1,
            initialDate: new Date(),
            finalDate: null,
            suscription: {
              name: 'PREMIUM',
            },
          };

          (userClientService.get as jest.Mock).mockResolvedValue(
            expectedUserClient,
          );

          (suscriptionRepository.findOne as jest.Mock).mockResolvedValue(
            expectedSuscription,
          );
          jest
            .spyOn(suscriptionService, 'get')
            .mockResolvedValue(expectedSuscription);

          (thirdPartyInterestService.getCurrentInterest as jest.Mock).mockResolvedValue(
            expectedThirdPartyInterest,
          );
          (clientBankAccountService.getOne as jest.Mock).mockResolvedValue(
            expectedClientBankAccount,
          );

          getRawOne.mockResolvedValue(undefined);
          jest
            .spyOn(suscriptionService, 'hasPendingUpgrade')
            .mockResolvedValue(false);

          (userSuscriptionRepository.findOne as jest.Mock).mockResolvedValue(
            expectedUserSuscription,
          );
          jest
            .spyOn(suscriptionService, 'getUserSuscription')
            .mockResolvedValue(expectedUserSuscription);

          expectedError = new BadRequestException();

          jest
            .spyOn(suscriptionService, 'upgradeToPremium')
            .mockRejectedValue(expectedError);
        });
        it('should throw when the user already has a suscription premium or gold', async () => {
          await expect(
            suscriptionService.upgradeToPremium(
              email,
              idBankAccount,
              costSuscription,
            ),
          ).rejects.toThrow(BadRequestException);
        });

        it('should not invoke paymentProviderService.createCharge()', () => {
          expect(paymentProviderService.createCharge).not.toHaveBeenCalled();
        });
        it('should not invoke transactionService.createUpgradeSuscriptionTransaction()', () => {
          expect(
            transactionService.createUpgradeSuscriptionTransaction,
          ).not.toHaveBeenCalled();
        });
      });
    });
  });

  describe('isAbleToUpgradeToGold(userClient)', () => {
    let expectedResult;
    let result;
    let userClient;
    let expectedUserSuscription;
    let expectedSuscription;
    let interests;

    describe('case: success', () => {
      describe('when everything works well', () => {
        beforeEach(async () => {
          userClient = {
            idUserClient: 1,
            email: 'prueba@gmail.com',
          };

          expectedUserSuscription = {
            idUserSuscription: 1,
            initialDate: new Date(),
            finalDate: null,
            suscription: {
              name: 'PREMIUM',
            },
          };
          expectedSuscription = {
            idSuscription: 1,
            name: 'gold',
            cost: 0,
            upgradedAmount: 100,
          };
          interests = {
            totalInterests: 200,
          };

          (userSuscriptionRepository.findOne as jest.Mock).mockResolvedValue(
            expectedUserSuscription,
          );
          jest
            .spyOn(suscriptionService, 'getUserSuscription')
            .mockResolvedValue(expectedUserSuscription);

          (suscriptionRepository.findOne as jest.Mock).mockResolvedValue(
            expectedSuscription,
          );
          jest
            .spyOn(suscriptionService, 'get')
            .mockResolvedValue(expectedSuscription);

          getRawOne.mockResolvedValue(interests);

          expectedResult = true;

          result = await suscriptionService.isAbleToUpgradeToGold(userClient);
        });
        it('should invoke transactionRepository.createQueryBuilder()', () => {
          expect(getRawOne).toHaveBeenCalledTimes(1);
        });

        it('should return true', () => {
          expect(result).toStrictEqual(expectedResult);
        });
      });
      describe('when the suscription is not premium', () => {
        beforeEach(async () => {
          userClient = {
            idUserClient: 1,
            email: 'prueba@gmail.com',
          };

          expectedUserSuscription = {
            idUserSuscription: 1,
            initialDate: new Date(),
            finalDate: null,
            suscription: {
              name: 'BASIC',
            },
          };

          (userSuscriptionRepository.findOne as jest.Mock).mockResolvedValue(
            expectedUserSuscription,
          );
          jest
            .spyOn(suscriptionService, 'getUserSuscription')
            .mockResolvedValue(expectedUserSuscription);

          expectedResult = false;

          result = await suscriptionService.isAbleToUpgradeToGold(userClient);
        });
        it('should return false', () => {
          expect(result).toStrictEqual(expectedResult);
        });
      });
      describe('when the totalInterests is not enough', () => {
        beforeEach(async () => {
          userClient = {
            idUserClient: 1,
            email: 'prueba@gmail.com',
          };

          expectedUserSuscription = {
            idUserSuscription: 1,
            initialDate: new Date(),
            finalDate: null,
            suscription: {
              name: 'PREMIUM',
            },
          };
          expectedSuscription = {
            idSuscription: 1,
            name: 'gold',
            cost: 0,
            upgradedAmount: 100,
          };
          interests = {
            totalInterests: 50,
          };

          (userSuscriptionRepository.findOne as jest.Mock).mockResolvedValue(
            expectedUserSuscription,
          );
          jest
            .spyOn(suscriptionService, 'getUserSuscription')
            .mockResolvedValue(expectedUserSuscription);

          (suscriptionRepository.findOne as jest.Mock).mockResolvedValue(
            expectedSuscription,
          );
          jest
            .spyOn(suscriptionService, 'get')
            .mockResolvedValue(expectedSuscription);

          getRawOne.mockResolvedValue(interests);

          expectedResult = false;

          result = await suscriptionService.isAbleToUpgradeToGold(userClient);
        });
        it('should invoke transactionRepository.createQueryBuilder()', () => {
          expect(getRawOne).toHaveBeenCalledTimes(1);
        });

        it('should return false', () => {
          expect(result).toStrictEqual(expectedResult);
        });
      });
    });
  });

  describe('sendGoldSubscriptionUpgradeEmail(userClient)', () => {
    let userClient;
    let expectedPlatformInterest;
    let expectedOnePointToDollars;
    let msg;
    let languageMails;
    let extraPoints;
    let subject;

    describe('case: success', () => {
      describe('when everything works well', () => {
        beforeEach(async () => {
          userClient = {
            idUserClient: 1,
            email: 'prueba@gmail.com',
            userDetails: [
              {
                firstName: 'Pedro',
                lastName: 'Perez',
                language: {
                  idLanguage: 1,
                  name: 'english',
                  shortname: 'en',
                },
                accountOwner: null,
              },
            ],
          };

          expectedPlatformInterest = {
            amount: 0,
            percentage: 0.2,
            points: 100,
          };
          expectedOnePointToDollars = {
            idPointsConversion: 1,
            onePointEqualsDollars: 0.002,
            initialDate: new Date(),
            finalDate: null,
          };

          languageMails = userClient.userDetails[0].language.name;
          extraPoints =
            parseFloat(expectedPlatformInterest.amount) /
            (100 * expectedOnePointToDollars.onePointEqualsDollars);
          subject = MailsSubjets.upgrade_to_gold[languageMails];
          msg = {
            to: userClient.email,
            subject: subject,
            templateId: 'prueba',
            dynamic_template_data: {
              user: userClient.userDetails[0].firstName,
              extraPoints,
            },
          };

          (platformInterestService.getInterestByName as jest.Mock).mockResolvedValue(
            expectedPlatformInterest,
          );

          (pointsConversionService.getRecentPointsConversion as jest.Mock).mockResolvedValue(
            expectedOnePointToDollars,
          );

          (configService.get as jest.Mock).mockReturnValue('prueba');

          (mailsService.sendEmail as jest.Mock).mockImplementation();

          await suscriptionService.sendGoldSubscriptionUpgradeEmail(userClient);
        });
        it('should invoke platformInterestService.getInterestByName()', () => {
          expect(
            platformInterestService.getInterestByName,
          ).toHaveBeenCalledTimes(1);
          expect(
            platformInterestService.getInterestByName,
          ).toHaveBeenCalledWith(PlatformInterest.GOLD_EXTRA);
        });
        it('should invoke pointsConversionService.getRecentPointsConversion()', () => {
          expect(
            pointsConversionService.getRecentPointsConversion,
          ).toHaveBeenCalledTimes(1);
        });
        it('should invoke mailsService.sendEmail()', () => {
          expect(mailsService.sendEmail).toHaveBeenCalledTimes(1);
          expect(mailsService.sendEmail).toHaveBeenCalledWith(msg);
        });
      });
    });
  });

  describe('upgradeSubscriptionIfIsPossible(idUserClient, transaction)', () => {
    let idUserClient;
    let transaction;
    let expectedUserClient;

    describe('case: success', () => {
      describe('when everything works well', () => {
        beforeEach(async () => {
          idUserClient = 1;
          transaction = {
            idTransaction: 1,
            totalAmountWithInterest: 77,
            rawAmount: 524,
            type: TransactionType.SUSCRIPTION_PAYMENT,
            clientBankAccount: {
              idClientBankAccount: 1,
            },
            paymentProviderTransactionId: null,
            stateTransaction: [
              {
                idStateTransaction: 1,
                finalDate: null,
              },
            ],
          };
          expectedUserClient = {
            idUserClient,
            email: 'prueba@gmail.com',
            userDetails: [
              {
                firstName: 'Pedro',
                lastName: 'Perez',
                accountOwner: null,
              },
            ],
          };

          (userClientService.get as jest.Mock).mockResolvedValue(
            expectedUserClient,
          );

          jest
            .spyOn(suscriptionService, 'createUserSuscription')
            .mockImplementation();

          jest
            .spyOn(suscriptionService, 'isAbleToUpgradeToGold')
            .mockResolvedValue(true);

          jest
            .spyOn(suscriptionService, 'createUserSuscription')
            .mockImplementation();

          jest
            .spyOn(suscriptionService, 'sendGoldSubscriptionUpgradeEmail')
            .mockImplementation();

          await suscriptionService.upgradeSubscriptionIfIsPossible(
            idUserClient,
            transaction,
          );
        });
        it('should invoke userClientService.get()', () => {
          expect(userClientService.get).toHaveBeenCalledTimes(1);
          expect(userClientService.get).toHaveBeenCalledWith({ idUserClient });
        });
      });
    });
  });

  describe('getActualSubscription(id)', () => {
    let result;
    let expectedSuscription;
    let id;

    describe('case: success', () => {
      describe('when everything works well', () => {
        beforeEach(async () => {
          id = 1;

          expectedSuscription = {
            idSuscription: 1,
            name: 'basic',
            cost: 0,
          };

          getOne.mockResolvedValue(expectedSuscription);

          result = await suscriptionService.getActualSubscription(id);
        });
        it('should invoke suscriptionRepository.createQueryBuilder()', () => {
          expect(getOne).toHaveBeenCalledTimes(1);
        });
        it('should return actual suscription', () => {
          expect(result).toStrictEqual(expectedSuscription);
        });
      });
    });
  });

  describe('getSubscriptionPercentage(subscription)', () => {
    let result;
    let expectedResult;
    let subscription;
    let expectedPlatformInterest;
    let expectedAmount;

    describe('case: success', () => {
      describe('when the suscription is gold', () => {
        beforeEach(async () => {
          subscription = 'gold';
          expectedPlatformInterest = {
            amount: 0,
            percentage: 0.2,
            points: 100,
            isGold: () => true,
          };
          expectedAmount = 100;
          expectedResult = {
            points: expectedPlatformInterest.points,
            amountUpgrade: expectedAmount,
            percentage: expectedPlatformInterest.percentage * 100,
          };

          getOne.mockResolvedValue(expectedPlatformInterest);

          jest
            .spyOn(suscriptionService, 'getGoldInfo')
            .mockResolvedValue(expectedAmount);

          result = await suscriptionService.getSubscriptionPercentage(
            subscription,
          );
        });
        it('should invoke platformInterestRepository.createQueryBuilder()', () => {
          expect(getOne).toHaveBeenCalledTimes(1);
        });
        it('should return data of a suscription', () => {
          expect(result).toStrictEqual(expectedResult);
        });
      });

      describe('when the suscription is not gold', () => {
        beforeEach(async () => {
          subscription = 'premium';
          expectedPlatformInterest = {
            amount: 0,
            percentage: 0.2,
            isGold: () => false,
          };
          expectedResult = {
            percentage: expectedPlatformInterest.percentage * 100,
          };

          getOne.mockResolvedValue(expectedPlatformInterest);

          result = await suscriptionService.getSubscriptionPercentage(
            subscription,
          );
        });
        it('should invoke platformInterestRepository.createQueryBuilder()', () => {
          expect(getOne).toHaveBeenCalledTimes(1);
        });
        it('should return data of a suscription', () => {
          expect(result).toStrictEqual(expectedResult);
        });
      });
    });
  });

  describe('getGoldInfo()', () => {
    let result;
    let expectedResult;
    let expectedSuscription;

    describe('case: success', () => {
      describe('when everything works well', () => {
        beforeEach(async () => {
          expectedSuscription = {
            idSuscription: 1,
            name: 'gold',
            cost: 0,
            upgradedAmount: 100,
          };
          expectedResult = 1;

          getOne.mockResolvedValue(expectedSuscription);

          result = await suscriptionService.getGoldInfo();
        });
        it('should invoke suscriptionRepository.createQueryBuilder()', () => {
          expect(getOne).toHaveBeenCalledTimes(1);
          expect(
            suscriptionRepository.createQueryBuilder().where,
          ).toHaveBeenCalledWith('su.name = :name', {
            name: SuscriptionType.GOLD,
          });
        });
        it('should return upgradeAmount of a gold suscription', () => {
          expect(result).toStrictEqual(expectedResult);
        });
      });
    });
  });

  describe('getActualCost(subscriptionName)', () => {
    let result;
    let expectedSuscription;
    let subscriptionName;

    describe('case: success', () => {
      describe('when everything works well', () => {
        beforeEach(async () => {
          subscriptionName = 'premium';
          expectedSuscription = {
            idSuscription: 1,
            name: subscriptionName,
            cost: 100,
          };

          getOne.mockResolvedValue(expectedSuscription);

          result = await suscriptionService.getActualCost(subscriptionName);
        });
        it('should invoke suscriptionRepository.createQueryBuilder()', () => {
          expect(getOne).toHaveBeenCalledTimes(1);
          expect(
            suscriptionRepository.createQueryBuilder().where,
          ).toHaveBeenCalledWith(`subscription.name = :name`, {
            name: subscriptionName,
          });
        });
        it('should return cost of a suscription', () => {
          expect(result).toStrictEqual(expectedSuscription);
        });
      });
    });
  });

  describe('update(updateSubscriptionDTO, idSuscription)', () => {
    let result;
    let updateResult;
    let updateSubscriptionDTO;
    let idSuscription;

    describe('case: success', () => {
      describe('when everything works well', () => {
        beforeEach(async () => {
          idSuscription = 1;
          updateSubscriptionDTO = {
            cost: 200,
          };
          updateResult = new UpdateResult();

          execute.mockResolvedValue(updateResult);

          result = await suscriptionService.update(
            updateSubscriptionDTO,
            idSuscription,
          );
        });
        it('should invoke suscriptionRepository.createQueryBuilder()', () => {
          expect(execute).toHaveBeenCalledTimes(1);
          expect(
            suscriptionRepository.createQueryBuilder().where,
          ).toHaveBeenCalledWith('idSuscription = :id', { id: idSuscription });
        });
        it('should return an updated result', () => {
          expect(result).toStrictEqual(updateResult);
        });
      });
    });
  });
});
