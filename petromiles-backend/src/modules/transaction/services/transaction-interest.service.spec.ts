import { TestingModule, Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { WinstonModule } from 'nest-winston';

import createOptions from '@/logger/winston/winston-config';

// ENTITIES
import { TransactionInterest } from '@/entities/transaction-interest.entity';

// SERVICES
import { TransactionInterestService } from '@/modules/transaction/services/transaction-interest.service';

// INTERFACES
import {
  expectedBankAccountVerificationTransaction,
} from './mocks/state-transaction.mock';

import { 
  expectedThirdPartyInterest,
  expectedPlatformInterest,
  expectedTransactionInterest,
} from './mocks/transaction-interest.mock';

describe('ClientBankAccountService', () => {
  let transactionInterestService: TransactionInterestService;
  let RepositoryMock: jest.Mock;
  let transactionInterestRepository: Repository<TransactionInterest>;
  
  beforeEach(() => {
    RepositoryMock = jest.fn(() => ({
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      query: jest.fn(),
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
        TransactionInterestService,
        {
          provide: getRepositoryToken(TransactionInterest),
          useClass: RepositoryMock,
        },
      ],
    }).compile();

    transactionInterestRepository = module.get(
      getRepositoryToken(TransactionInterest),
    );
    transactionInterestService = module.get<TransactionInterestService>(
      TransactionInterestService
    );
  });

  describe('createTransactionInterest(transaction, thirdPartyInterest, platformInterest, promotion, platformInterestExtraPoints)', 
  () => {
    let TransactionParams;
    let ThirdPartyInterestParams;
    let PlatformInterestParams;
    let result;

    describe('case: success', () => {
      describe('when everything works fine without 2 parameters', () => {
        beforeEach(async () => {
          TransactionParams = expectedBankAccountVerificationTransaction;
          ThirdPartyInterestParams = expectedThirdPartyInterest;
          PlatformInterestParams = expectedPlatformInterest;

          (transactionInterestRepository.save as jest.Mock).mockResolvedValue(
            expectedTransactionInterest,
          );

          result = await transactionInterestService.createTransactionInterest(
            TransactionParams,
            ThirdPartyInterestParams,
            PlatformInterestParams,
            null,
            null,
          );
        });

        it('should return a transaction interest ', () => {
          expect(result).toStrictEqual(expectedTransactionInterest);
        });
      });
    });
  });
});