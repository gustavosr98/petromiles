import { TestingModule, Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { WinstonModule } from 'nest-winston';

import createOptions from '@/logger/winston/winston-config';

// ENTITIES
import { StateTransaction } from '@/entities/state-transaction.entity';

// SERVICES
import { ManagementService } from '@/modules/management/services/management.service';
import { StateTransactionService } from '@/modules/transaction/services/state-transaction.service';

// INTERFACES
import { StateName, StateDescription } from '@/enums/state.enum';
import {
  expectedBankAccountVerificationTransaction,
  expectedStateVerificationTransaction,
  expectedStateValidTransaction,
  expectedBankAccountTransaction,
} from './mocks/state-transaction.mock';

describe('StateTransactionService', () => {
  let stateTransactionService: StateTransactionService;
  let managementService: ManagementService;
  let RepositoryMock: jest.Mock;
  let statetransactionRepository: Repository<StateTransaction>;
  let ManagementServiceMock: jest.Mock<Partial<ManagementService>>;

  beforeEach(() => {
    RepositoryMock = jest.fn(() => ({
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      query: jest.fn(),
    }));

    ManagementServiceMock = jest.fn<Partial<ManagementService>,ManagementService[]>(
      () => ({
        getState: jest.fn(),
      }),
    );
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        WinstonModule.forRoot(
          createOptions({ fileName: 'petromiles-global.log' }),
        ),
      ],
      providers: [
        StateTransactionService,
        {
          provide: getRepositoryToken(StateTransaction),
          useClass: RepositoryMock,
        },
        {
          provide: ManagementService,
          useClass: ManagementServiceMock,
        },
      ],
    }).compile();

    statetransactionRepository = module.get(
      getRepositoryToken(StateTransaction),
    );
    managementService = module.get<ManagementService>(ManagementService);
    stateTransactionService = module.get<StateTransactionService>(StateTransactionService);
  });

  describe('createStateTransaction(transaction, description, stateName)', () => {
    let TransactionCreateParams;
    let result;

    describe('case: success', () => {
      describe('when everything works well', () => {
        beforeEach(async () => {
          TransactionCreateParams = expectedBankAccountVerificationTransaction;

          (statetransactionRepository.save as jest.Mock).mockResolvedValue(
            expectedStateVerificationTransaction,
          );
          
          (managementService.getState as jest.Mock).mockImplementation();

          result = await stateTransactionService.createStateTransaction(
            TransactionCreateParams,
            StateDescription.VERIFICATION_TRANSACTION_CREATION,
            StateName.VERIFYING,
          );
        });

        it('should invoke managementService.getState()', () => {
          expect(managementService.getState).toHaveBeenCalledTimes(1);
          expect(managementService.getState).toHaveBeenCalledWith(
            StateName.VERIFYING,
          );
        });
        
        it('should return a state transaction', () => {
          expect(result).toStrictEqual(expectedStateVerificationTransaction);
        });
      });      
    });
  });

  describe('update(stateName, transaction, description)', () => {
    let TransactionStateParams;
    let result;

    describe('case: success', () => {
      describe('when everything works well', () => {
        beforeEach(async () => {
          TransactionStateParams = expectedBankAccountTransaction;

          (statetransactionRepository.save as jest.Mock).mockResolvedValue(
            expectedStateValidTransaction,
          );

          (managementService.getState as jest.Mock).mockImplementation();

          result = await stateTransactionService.update(
            StateName.VALID,
            TransactionStateParams,
            StateDescription.CHANGE_VERIFICATION_TO_VALID,
          );
        });

        it('should invoke managementService.getState()', () => {
          expect(managementService.getState).toHaveBeenCalledTimes(1);
          expect(managementService.getState).toHaveBeenCalledWith(
            StateName.VALID,
          );
        });

        it('should return a state transaction', () => {
          expect(result).toStrictEqual(expectedStateValidTransaction);
        });
      });
    });
  });
});