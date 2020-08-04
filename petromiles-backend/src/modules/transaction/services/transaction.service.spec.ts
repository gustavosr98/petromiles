import { TransactionType } from '@/enums/transaction.enum';
import { StateName } from '@/enums/state.enum';
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
});
