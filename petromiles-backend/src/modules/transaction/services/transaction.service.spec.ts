import { TransactionDetails } from '@/modules/transaction/interfaces/transaction-details.interface';
import { TransactionType } from '@/enums/transaction.enum';
import { StateName, StateDescription } from '@/enums/state.enum';
import { PaymentProvider } from '@/enums/payment-provider.enum';
import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';

import { TransactionService } from '@/modules/transaction/services/transaction.service';
import { PointsConversionService } from '@/modules/management/services/points-conversion.service';
import { ThirdPartyInterestService } from '@/modules/management/services/third-party-interest.service';
import { PlatformInterestService } from '@/modules/management/services/platform-interest.service';
import { StateTransactionService } from '@/modules/transaction/services/state-transaction.service';
import { TransactionInterestService } from '@/modules/transaction/services/transaction-interest.service';

import { Transaction } from '@/entities/transaction.entity';
import { UserClient } from '@/entities/user-client.entity';

import { WinstonModule } from 'nest-winston';
import createOptions from '../../../logger/winston/winston-config';
import { PlatformInterest } from '@/enums/platform-interest.enum';

describe('TransactionService', () => {
  let transactionService: TransactionService;
  let RepositoryMock: jest.Mock;
  let userClientRepository: Repository<UserClient>;
  let transactionRepository: Repository<Transaction>;
  let PlatformInterestServiceMock: jest.Mock<Partial<PlatformInterestService>>;
  let platformInterestService: PlatformInterestService;
  let PointsConversionServiceMock: jest.Mock<Partial<PointsConversionService>>;
  let pointsConversionService: PointsConversionService;
  let ThirdPartyInterestServiceMock: jest.Mock<Partial<
    ThirdPartyInterestService
  >>;
  let thirdPartyInterestService: ThirdPartyInterestService;
  let TransactionInterestServiceMock: jest.Mock<Partial<
    TransactionInterestService
  >>;
  let transactionInterestService: TransactionInterestService;
  let StateTransactionServiceMock: jest.Mock<Partial<StateTransactionService>>;
  let stateTransactionService: StateTransactionService;

  beforeEach(() => {
    RepositoryMock = jest.fn(() => ({
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      query: jest.fn(),
    }));
    PlatformInterestServiceMock = jest.fn<
      Partial<PlatformInterestService>,
      PlatformInterestService[]
    >(() => ({
      getInterestByName: jest.fn(),
    }));
    PointsConversionServiceMock = jest.fn<
      Partial<PointsConversionService>,
      PointsConversionService[]
    >(() => ({
      getRecentPointsConversion: jest.fn(),
    }));
    ThirdPartyInterestServiceMock = jest.fn<
      Partial<ThirdPartyInterestService>,
      ThirdPartyInterestService[]
    >(() => ({
      getCurrentInterest: jest.fn(),
    }));
    TransactionInterestServiceMock = jest.fn<
      Partial<TransactionInterestService>,
      TransactionInterestService[]
    >(() => ({
      createTransactionInterest: jest.fn(),
      getExtraPointsTypeByTransaction: jest.fn(),
    }));
    StateTransactionServiceMock = jest.fn<
      Partial<StateTransactionService>,
      StateTransactionService[]
    >(() => ({
      createStateTransaction: jest.fn(),
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
        TransactionService,
        {
          provide: getRepositoryToken(UserClient),
          useClass: RepositoryMock,
        },
        {
          provide: getRepositoryToken(Transaction),
          useClass: RepositoryMock,
        },
        {
          provide: PlatformInterestService,
          useClass: PlatformInterestServiceMock,
        },
        {
          provide: PointsConversionService,
          useClass: PointsConversionServiceMock,
        },
        {
          provide: ThirdPartyInterestService,
          useClass: ThirdPartyInterestServiceMock,
        },
        {
          provide: TransactionInterestService,
          useClass: TransactionInterestServiceMock,
        },
        {
          provide: StateTransactionService,
          useClass: StateTransactionServiceMock,
        },
      ],
    }).compile();

    transactionService = module.get<TransactionService>(TransactionService);
    userClientRepository = module.get(getRepositoryToken(UserClient));
    transactionRepository = module.get(getRepositoryToken(Transaction));
    platformInterestService = module.get<PlatformInterestService>(
      PlatformInterestService,
    );
    pointsConversionService = module.get<PointsConversionService>(
      PointsConversionService,
    );
    thirdPartyInterestService = module.get<ThirdPartyInterestService>(
      ThirdPartyInterestService,
    );
    transactionInterestService = module.get<TransactionInterestService>(
      TransactionInterestService,
    );
    stateTransactionService = module.get<StateTransactionService>(
      StateTransactionService,
    );
  });

  describe('getAllFiltered(stateNames, transactionsTypes, paymentProviders, idClientBankAccount, isVerification)', () => {
    let expectedTransactions: DeepPartial<Transaction>[];
    let result: DeepPartial<Transaction>[];
    let stateNames: StateName[];
    let transactionsTypes: TransactionType[];
    let paymentProviders: PaymentProvider[];
    let idClientBankAccount: number;
    let isVerification: boolean;

    describe('case: success', () => {
      describe('when everything works well', () => {
        beforeEach(async () => {
          stateNames = [StateName.VERIFYING];
          transactionsTypes = [TransactionType.DEPOSIT];
          paymentProviders = [PaymentProvider.STRIPE];
          idClientBankAccount = 1;
          isVerification = true;
          expectedTransactions = [
            {
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
            },
          ];

          (transactionRepository.query as jest.Mock).mockResolvedValue(
            expectedTransactions,
          );

          result = await transactionService.getAllFiltered(
            stateNames,
            transactionsTypes,
            paymentProviders,
            idClientBankAccount,
            isVerification,
          );
        });

        it('should invoke transactionRepository.query()', () => {
          expect(transactionRepository.query).toHaveBeenCalledTimes(1);
        });

        it('should return an array of transactions', () => {
          expect(result).toStrictEqual(expectedTransactions);
        });
      });
    });
  });

  describe('getTransactionsAdmin()', () => {
    let expectedTransactionsDetails: DeepPartial<
      App.Transaction.TransactionDetails
    >[];
    let result: DeepPartial<App.Transaction.TransactionDetails>[];
    let expectedTransactions;

    describe('case: success', () => {
      describe('when everything works well', () => {
        beforeEach(async () => {
          expectedTransactionsDetails = [
            {
              id: 1,
              type: TransactionType.DEPOSIT,
              bankAccount: 'prueba',
              state: StateName.VALID,
              amount: 100,
              interest: 10,
              pointsEquivalent: 50000,
              pointsConversion: 0.002,
              total: 110,
              clientBankAccountEmail: 'prueba@gmail.com',
            },
          ];
          expectedTransactions = [
            {
              calculateDetails: () => expectedTransactionsDetails[0],
            },
          ];

          (transactionRepository.find as jest.Mock).mockResolvedValue(
            expectedTransactions,
          );

          result = await transactionService.getTransactionsAdmin();
        });

        it('should invoke transactionRepository.find()', () => {
          expect(transactionRepository.find).toHaveBeenCalledTimes(1);
        });

        it('should return an array of transactions', () => {
          expect(result).toStrictEqual(expectedTransactionsDetails);
        });
      });
    });
  });

  describe('getThirdPartyTransactions(idThirdPartyClient, apiKey, filter)', () => {
    let expectedTransactionsDetails: DeepPartial<TransactionDetails>[];
    let result: DeepPartial<TransactionDetails>[];
    let idThirdPartyClient: number;
    let apiKey: string;
    let filter;
    let expectedTransactions;

    describe('case: success', () => {
      describe('when everything works well', () => {
        beforeEach(async () => {
          idThirdPartyClient = 1;
          apiKey = 'prueba';
          filter = {
            transactionIds: [1],
          };
          expectedTransactionsDetails = [
            {
              id: 1,
              type: TransactionType.DEPOSIT,
              bankAccount: 'prueba',
              state: StateName.VALID,
              amount: 100,
              interest: 10,
              pointsEquivalent: 50000,
              pointsConversion: 0.002,
              total: 110,
              clientBankAccountEmail: 'prueba@gmail.com',
            },
          ];
          expectedTransactions = [
            {
              calculateDetails: () => expectedTransactionsDetails[0],
            },
          ];

          (transactionRepository.find as jest.Mock).mockResolvedValue(
            expectedTransactions,
          );

          result = await transactionService.getThirdPartyTransactions({
            idThirdPartyClient,
            apiKey,
            filter,
          });
        });

        it('should invoke transactionRepository.find()', () => {
          expect(transactionRepository.find).toHaveBeenCalledTimes(1);
        });

        it('should return an array of transactions', () => {
          expect(result).toStrictEqual(expectedTransactionsDetails);
        });
      });
    });
  });

  describe('getTransactionInterests(options)', () => {
    let expectedTransactionInterests;
    let result;
    let options;
    let expectedPlatformInterest;
    let expectedThirdPartyInterest;
    let expectedOnePointToDollars;

    describe('case: success', () => {
      describe('when everything works well', () => {
        beforeEach(async () => {
          options = {
            platformInterestType: PlatformInterest.BUY,
            thirdPartyInterestType: PaymentProvider.STRIPE,
            type: TransactionType.DEPOSIT,
          };
          expectedPlatformInterest = { amount: 0, percentage: 0.1 };
          expectedOnePointToDollars = {
            idPointsConversion: 1,
            onePointEqualsDollars: 0.002,
            initialDate: new Date(),
            finalDate: null,
          };
          expectedThirdPartyInterest = { amount: 75, percentage: 0 };

          expectedTransactionInterests = {
            interest: expectedPlatformInterest,
            extraPoints: null,
            pointsConversion: expectedOnePointToDollars,
            thirdPartyInterest: expectedThirdPartyInterest,
          };

          (platformInterestService.getInterestByName as jest.Mock).mockResolvedValue(
            expectedPlatformInterest,
          );
          (pointsConversionService.getRecentPointsConversion as jest.Mock).mockResolvedValue(
            expectedOnePointToDollars,
          );
          (thirdPartyInterestService.getCurrentInterest as jest.Mock).mockResolvedValue(
            expectedThirdPartyInterest,
          );

          result = await transactionService.getTransactionInterests(options);
        });

        it('should invoke platformInterestService.getInterestByName()', () => {
          expect(
            platformInterestService.getInterestByName,
          ).toHaveBeenCalledTimes(1);
          expect(
            platformInterestService.getInterestByName,
          ).toHaveBeenCalledWith(options.platformInterestType);
        });

        it('should invoke pointsConversionService.getRecentPointsConversion()', () => {
          expect(
            pointsConversionService.getRecentPointsConversion,
          ).toHaveBeenCalledTimes(1);
        });

        it('should invoke thirdPartyInterestService.getCurrentInterest()', () => {
          expect(
            thirdPartyInterestService.getCurrentInterest,
          ).toHaveBeenCalledTimes(1);
          expect(
            thirdPartyInterestService.getCurrentInterest,
          ).toHaveBeenCalledWith(options.thirdPartyInterestType, options.type);
        });

        it('should return a TransactionInterests data', () => {
          expect(result).toStrictEqual(expectedTransactionInterests);
        });
      });
    });
  });

  describe('getTransactions(idUserClient)', () => {
    let expectedTransactionsDetails: DeepPartial<TransactionDetails>[];
    let result: DeepPartial<TransactionDetails>[];
    let idUserClient: number;
    let expectedUserClient;
    let expectedTransactions;

    describe('case: success', () => {
      describe('when everything works well', () => {
        beforeEach(async () => {
          idUserClient = 1;
          expectedUserClient = {
            idUserClient: 1,
            email: 'prueba@gmail.com',
          };
          expectedTransactionsDetails = [
            {
              id: 1,
              type: TransactionType.DEPOSIT,
              bankAccount: 'prueba',
              state: StateName.VALID,
              amount: 100,
              interest: 10,
              pointsEquivalent: 50000,
              pointsConversion: 0.002,
              total: 110,
              clientBankAccountEmail: 'prueba@gmail.com',
            },
          ];
          expectedTransactions = [
            {
              calculateDetails: () => expectedTransactionsDetails[0],
            },
          ];

          (userClientRepository.findOne as jest.Mock).mockResolvedValue(
            expectedUserClient,
          );

          (transactionRepository.find as jest.Mock).mockResolvedValue(
            expectedTransactions,
          );

          result = await transactionService.getTransactions(idUserClient);
        });

        it('should invoke userClientRepository.findOne()', () => {
          expect(userClientRepository.findOne).toHaveBeenCalledTimes(1);
          expect(userClientRepository.findOne).toHaveBeenCalledWith({
            idUserClient,
          });
        });

        it('should invoke transactionRepository.find()', () => {
          expect(transactionRepository.find).toHaveBeenCalledTimes(1);
        });

        it('should return an array of transactions', () => {
          expect(result).toStrictEqual(expectedTransactionsDetails);
        });
      });
    });
  });

  describe('get(idTransaction)', () => {
    let expectedTransactionsDetails: DeepPartial<TransactionDetails>;
    let result: DeepPartial<TransactionDetails>;
    let idTransaction: number;
    let expectedTransactions;

    describe('case: success', () => {
      describe('when everything works well', () => {
        beforeEach(async () => {
          idTransaction = 1;
          expectedTransactionsDetails = {
            id: 1,
            type: TransactionType.DEPOSIT,
            bankAccount: 'prueba',
            state: StateName.VALID,
            amount: 100,
            interest: 10,
            pointsEquivalent: 50000,
            pointsConversion: 0.002,
            total: 110,
            clientBankAccountEmail: 'prueba@gmail.com',
          };
          expectedTransactions = {
            calculateDetails: () => expectedTransactionsDetails,
          };

          (transactionRepository.findOne as jest.Mock).mockResolvedValue(
            expectedTransactions,
          );

          result = await transactionService.get(idTransaction);
        });

        it('should invoke transactionRepository.findOne()', () => {
          expect(transactionRepository.findOne).toHaveBeenCalledTimes(1);
          expect(transactionRepository.findOne).toHaveBeenCalledWith(
            idTransaction,
          );
        });

        it('should return a transactions', () => {
          expect(result).toStrictEqual(expectedTransactionsDetails);
        });
      });
    });
  });

  describe('createTransaction(options, state)', () => {
    let expectedTransaction;
    let result;
    let options;
    let state;
    let expectedPlatformInterest;
    let expectedPointsConversion;
    let expectedStateTransaction;
    let expectedTransactionInterest;

    describe('case: success', () => {
      describe('when everything works well', () => {
        beforeEach(async () => {
          expectedPlatformInterest = { amount: 0, percentage: 0.1 };
          expectedPointsConversion = {
            idPointsConversion: 1,
            onePointEqualsDollars: 0.002,
            initialDate: new Date(),
            finalDate: null,
          };
          expectedTransaction = {
            totalAmountWithInterest: 77,
            rawAmount: 524,
            type: TransactionType.DEPOSIT,
            pointsConversion: expectedPointsConversion,
            platformInterest: expectedPlatformInterest,
            stateTransactionDescription: StateDescription.DEPOSIT,
            thirdPartyInterest: null,
            promotion: null,
            platformInterestExtraPoints: null,
          };
          options = expectedTransaction;
          state = StateName.VALID;
          expectedStateTransaction = {
            idStateTransaction: 1,
            initialDate: new Date(),
            finalDate: null,
          };
          expectedTransactionInterest = {
            idTransactionInterest: 1,
            platformInterest: expectedPlatformInterest,
          };

          (transactionRepository.save as jest.Mock).mockResolvedValue(
            expectedTransaction,
          );
          (stateTransactionService.createStateTransaction as jest.Mock).mockResolvedValue(
            expectedStateTransaction,
          );
          (transactionInterestService.createTransactionInterest as jest.Mock).mockResolvedValue(
            expectedTransactionInterest,
          );

          result = await transactionService.createTransaction(options, state);
        });

        it('should invoke transactionRepository.save()', () => {
          expect(transactionRepository.save).toHaveBeenCalledTimes(1);
          expect(transactionRepository.save).toHaveBeenCalledWith(options);
        });

        it('should invoke stateTransactionService.createStateTransaction()', () => {
          expect(
            stateTransactionService.createStateTransaction,
          ).toHaveBeenCalledTimes(1);
          expect(
            stateTransactionService.createStateTransaction,
          ).toHaveBeenCalledWith(
            expectedTransaction,
            options.stateTransactionDescription,
            state,
          );
        });

        it('should invoke transactionInterestService.createTransactionInterest()', () => {
          expect(
            transactionInterestService.createTransactionInterest,
          ).toHaveBeenCalledTimes(1);
          expect(
            transactionInterestService.createTransactionInterest,
          ).toHaveBeenCalledWith(
            expectedTransaction,
            options.thirdPartyInterest,
            options.platformInterest,
            options.promotion,
            options.platformInterestExtraPoints,
          );
        });

        it('should return a transactions', () => {
          expect(result).toStrictEqual(expectedTransaction);
        });
      });
    });
  });

  describe('getClientBankAccountTransaction(clientBankAccount)', () => {
    let expectedTransactions;
    let result;
    let clientBankAccount;

    describe('case: success', () => {
      describe('when everything works well', () => {
        beforeEach(async () => {
          clientBankAccount = {
            idClientBankAccount: 1,
            paymentProvider: PaymentProvider.STRIPE,
            primary: true,
          };
          expectedTransactions = [
            {
              idTransaction: 1,
              totalAmountWithInterest: 77,
              rawAmount: 524,
              type: TransactionType.DEPOSIT,
              clientBankAccount: clientBankAccount,
              paymentProviderTransactionId: null,
              stateTransaction: [
                {
                  idStateTransaction: 1,
                  finalDate: null,
                },
              ],
            },
          ];

          (transactionRepository.find as jest.Mock).mockResolvedValue(
            expectedTransactions,
          );

          result = await transactionService.getClientBankAccountTransaction(
            clientBankAccount,
          );
        });

        it('should invoke transactionRepository.find()', () => {
          expect(transactionRepository.find).toHaveBeenCalledTimes(1);
          expect(transactionRepository.find).toHaveBeenCalledWith({
            clientBankAccount,
          });
        });

        it('should return a transactions', () => {
          expect(result).toStrictEqual(expectedTransactions);
        });
      });
    });
  });

  describe('getExtraPointsOfATransaction(idTransaction)', () => {
    let result;
    let idTransaction: number;
    let expectedTransaction;
    let expectedExtraPoints: string;

    describe('case: success', () => {
      describe('when everything works well', () => {
        beforeEach(async () => {
          idTransaction = 1;
          expectedExtraPoints = 'GOLD';
          expectedTransaction = {
            idTransaction: 1,
            totalAmountWithInterest: 77,
            rawAmount: 524,
            type: TransactionType.DEPOSIT,
            paymentProviderTransactionId: null,
            stateTransaction: [
              {
                idStateTransaction: 1,
                finalDate: null,
              },
            ],
          };

          (transactionRepository.findOne as jest.Mock).mockResolvedValue(
            expectedTransaction,
          );
          (transactionInterestService.getExtraPointsTypeByTransaction as jest.Mock).mockResolvedValue(
            expectedExtraPoints,
          );

          result = await transactionService.getExtraPointsOfATransaction(
            idTransaction,
          );
        });

        it('should invoke transactionRepository.findOne()', () => {
          expect(transactionRepository.findOne).toHaveBeenCalledTimes(1);
          expect(transactionRepository.findOne).toHaveBeenCalledWith(
            idTransaction,
          );
        });

        it('should invoke transactionInterestService.getExtraPointsTypeByTransaction()', () => {
          expect(
            transactionInterestService.getExtraPointsTypeByTransaction,
          ).toHaveBeenCalledTimes(1);
          expect(
            transactionInterestService.getExtraPointsTypeByTransaction,
          ).toHaveBeenCalledWith(expectedTransaction);
        });

        it('should return tne name of the extra points of a transaction', () => {
          expect(result).toStrictEqual(expectedExtraPoints);
        });
      });
    });
  });
});
