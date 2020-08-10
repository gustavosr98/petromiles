import { TestingModule, Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { BadRequestException } from '@nestjs/common';

import { Repository } from 'typeorm';
import { WinstonModule } from 'nest-winston';

import createOptions from '@/logger/winston/winston-config';

import { ClientBankAccount } from '@/entities/client-bank-account.entity';
import { StateBankAccount } from '@/entities/state-bank-account.entity';
import { BankAccount } from '@/entities/bank-account.entity';

import { ClientBankAccountService } from './client-bank-account.service';
import { StateTransactionService } from '@/modules/transaction/services/state-transaction.service';
import { UserClientService } from '@/modules/user/services/user-client.service';
import { TransactionService } from '@/modules/transaction/services/transaction.service';
import { PaymentProviderService } from '@/modules/payment-provider/payment-provider.service';
import { ManagementService } from '@/modules/management/services/management.service';
import { MailsService } from '@/modules/mails/mails.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BankAccountService } from './bank-account.service';

import { PaymentProvider } from '@/enums/payment-provider.enum';
import { StateName } from '@/enums/state.enum';
import { TransactionType } from '@/enums/transaction.enum';
import { StateDescription } from '@/enums/state.enum';
import {
  stateUser,
  userDetails,
  userSuscription,
  bankAccount,
  stateBankAccount,
  blockedState,
} from './mocks/client-bank-account.mock';
import {
  expectedClientBankAccount,
  expectedUserClient,
  createBankAccountDTO,
  expectedBankAccount,
  expectedPaymentProviderBankAccount,
  expectedChangeBankAccount,
  expectedVerification,
  expectedVerificationTransactions,
  expectedTransactions,
  verifyingState,
  expectedStateBankAccount,
  expectedClientBankAccountToBePrimary,
} from '@/modules/bank-account/services/mocks/client-bank-account.mock';

describe('ClientBankAccountService', () => {
  let clientBankAccountService: ClientBankAccountService;
  let RepositoryMock: jest.Mock;
  let clientBankAccountRepository: Repository<ClientBankAccount>;
  let bankAccountRepository: Repository<BankAccount>;
  let stateBankAccountRepository: Repository<StateBankAccount>;
  let bankAccountService: BankAccountService;
  let BankAccountServiceMock: jest.Mock<Partial<BankAccountService>>;
  let StateTransactionServiceMock: jest.Mock<Partial<StateTransactionService>>;
  let stateTransactionService: StateTransactionService;
  let UserClientServiceMock: jest.Mock<Partial<UserClientService>>;
  let userClientService: UserClientService;
  let TransactionServiceMock: jest.Mock<Partial<TransactionService>>;
  let transactionService: TransactionService;
  let PaymentProviderServiceMock: jest.Mock<Partial<PaymentProviderService>>;
  let paymentProviderService: PaymentProviderService;
  let ManagementServiceMock: jest.Mock<Partial<ManagementService>>;
  let managementService: ManagementService;
  let MailsServiceMock: jest.Mock<Partial<MailsService>>;
  let mailsService: MailsService;
  let ConfigServiceMock: jest.Mock<Partial<ConfigService>>;
  let configService: ConfigService;

  beforeEach(() => {
    RepositoryMock = jest.fn(() => ({
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      query: jest.fn(),
    }));

    StateTransactionServiceMock = jest.fn<
      Partial<StateTransactionService>,
      StateTransactionService[]
    >(() => ({
      update: jest.fn(),
    }));

    BankAccountServiceMock = jest.fn<
      Partial<BankAccountService>,
      BankAccountService[]
    >(() => ({
      create: jest.fn(),
    }));

    UserClientServiceMock = jest.fn<
      Partial<UserClientService>,
      UserClientService[]
    >(() => ({
      get: jest.fn(),
    }));

    TransactionServiceMock = jest.fn<
      Partial<TransactionService>,
      TransactionService[]
    >(() => ({
      getAllFiltered: jest.fn(),
      getClientBankAccountTransaction: jest.fn(),
      update: jest.fn(),
      createVerificationTransaction: jest.fn(),
    }));

    ManagementServiceMock = jest.fn<
      Partial<ManagementService>,
      ManagementService[]
    >(() => ({
      getState: jest.fn(),
    }));

    PaymentProviderServiceMock = jest.fn<
      Partial<PaymentProviderService>,
      PaymentProviderService[]
    >(() => ({
      deleteBankAccount: jest.fn(),
      verifyBankAccount: jest.fn(),
      createBankAccount: jest.fn(),
    }));

    MailsServiceMock = jest.fn<Partial<MailsService>, MailsService[]>(() => ({
      sendEmail: jest.fn(),
    }));
    ConfigServiceMock = jest.fn<Partial<ConfigService>, ConfigService[]>(
      () => ({
        get: jest.fn(),
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
        ClientBankAccountService,
        {
          provide: getRepositoryToken(ClientBankAccount),
          useClass: RepositoryMock,
        },
        {
          provide: getRepositoryToken(BankAccount),
          useClass: RepositoryMock,
        },
        {
          provide: getRepositoryToken(StateBankAccount),
          useClass: RepositoryMock,
        },
        {
          provide: PaymentProviderService,
          useClass: PaymentProviderServiceMock,
        },
        {
          provide: BankAccountService,
          useClass: BankAccountServiceMock,
        },
        {
          provide: StateTransactionService,
          useClass: StateTransactionServiceMock,
        },
        {
          provide: UserClientService,
          useClass: UserClientServiceMock,
        },
        {
          provide: TransactionService,
          useClass: TransactionServiceMock,
        },
        {
          provide: ManagementService,
          useClass: ManagementServiceMock,
        },
        {
          provide: MailsService,
          useClass: MailsServiceMock,
        },
        {
          provide: ConfigService,
          useClass: ConfigServiceMock,
        },
      ],
    }).compile();

    clientBankAccountService = module.get<ClientBankAccountService>(
      ClientBankAccountService,
    );
    stateBankAccountRepository = module.get(
      getRepositoryToken(StateBankAccount),
    );
    bankAccountRepository = module.get(getRepositoryToken(BankAccount));
    clientBankAccountRepository = module.get(
      getRepositoryToken(ClientBankAccount),
    );

    paymentProviderService = module.get<PaymentProviderService>(
      PaymentProviderService,
    );

    stateTransactionService = module.get<StateTransactionService>(
      StateTransactionService,
    );

    clientBankAccountService = module.get<ClientBankAccountService>(
      ClientBankAccountService,
    );
    bankAccountService = module.get<BankAccountService>(BankAccountService);
    transactionService = module.get<TransactionService>(TransactionService);
    userClientService = module.get<UserClientService>(UserClientService);
    mailsService = module.get<MailsService>(MailsService);
    configService = module.get<ConfigService>(ConfigService);
    managementService = module.get<ManagementService>(ManagementService);
  });

  describe('create(bankAccountCreateParams, user)', () => {
    let bankAccountCreateParams;
    let user;
    let expectedNicknameIsTaken;
    let expectedChangeState;
    let result;

    describe('case: success', () => {
      describe('when everything works well', () => {
        beforeEach(async () => {
          bankAccountCreateParams = createBankAccountDTO;
          user = { email: 'test@petromiles.com', id: 1, role: 'CLIENT' };
          expectedNicknameIsTaken = false;
          expectedChangeState = expectedChangeBankAccount;

          jest
            .spyOn(clientBankAccountService, 'nicknameIsTaken')
            .mockResolvedValue(expectedNicknameIsTaken);

          (userClientService.get as jest.Mock).mockResolvedValue(
            expectedUserClient,
          );

          (bankAccountService.create as jest.Mock).mockResolvedValue(
            expectedBankAccount,
          );

          (paymentProviderService.createBankAccount as jest.Mock).mockResolvedValue(
            expectedPaymentProviderBankAccount,
          );

          (clientBankAccountRepository.save as jest.Mock).mockResolvedValue(
            expectedClientBankAccount,
          );

          jest
            .spyOn(clientBankAccountService, 'changeState')
            .mockResolvedValue(expectedChangeState);

          transactionService.createVerificationTransaction as jest.Mock;

          result = await clientBankAccountService.create(
            bankAccountCreateParams,
            user,
          );
        });

        it('should invoke userClientService.get()', () => {
          expect(userClientService.get).toHaveBeenCalledTimes(1);
          expect(userClientService.get).toHaveBeenCalledWith({
            email: user.email,
          });
        });

        it('should invoke bankAccountService.create()', () => {
          expect(bankAccountService.create).toHaveBeenCalledTimes(1);
          expect(bankAccountService.create).toHaveBeenCalledWith(
            bankAccountCreateParams,
          );
        });

        it('should invoke paymentProviderService.createBankAccount()', () => {
          expect(
            paymentProviderService.createBankAccount,
          ).toHaveBeenCalledTimes(1);
          expect(paymentProviderService.createBankAccount).toHaveBeenCalledWith(
            expectedUserClient,
            bankAccountCreateParams,
          );
        });

        it('should invoke clientBankAccountRepository.save()', () => {
          expect(clientBankAccountRepository.save).toHaveBeenCalledTimes(1);
          expect(clientBankAccountRepository.save).toHaveBeenCalledWith({
            bankAccount: expectedBankAccount,
            userClient: expectedUserClient,
            transferId: expectedPaymentProviderBankAccount.transferId,
            chargeId: expectedPaymentProviderBankAccount.chargeId,
            paymentProvider: 'STRIPE',
          });
        });

        it('should invoke transactionService.createVerificationTransaction()', () => {
          expect(
            transactionService.createVerificationTransaction,
          ).toHaveBeenCalledTimes(1);
          expect(
            transactionService.createVerificationTransaction,
          ).toHaveBeenCalledWith(expectedClientBankAccount);
        });

        it('should return a client bank account', () => {
          expect(result).toStrictEqual(expectedClientBankAccount);
        });
      });
    });

    describe('case: failure', () => {
      let expectedError: BadRequestException;
      describe('when nickname is taken', () => {
        beforeEach(() => {
          expectedNicknameIsTaken = true;
          bankAccountCreateParams = createBankAccountDTO;
          user = { email: 'test@petromiles.com', id: 1, role: 'CLIENT' };

          jest
            .spyOn(clientBankAccountService, 'nicknameIsTaken')
            .mockResolvedValue(expectedNicknameIsTaken);

          expectedError = new BadRequestException();

          jest
            .spyOn(clientBankAccountService, 'create')
            .mockRejectedValue(expectedError);
        });

        it('should throw when user indicates a nickname already taken', async () => {
          await expect(
            clientBankAccountService.create(bankAccountCreateParams, user),
          ).rejects.toThrow(BadRequestException);
        });

        it('should not invoke userClientService.get()', () => {
          expect(userClientService.get).not.toHaveBeenCalled();
        });

        it('should not invoke bankAccountService.create()', () => {
          expect(bankAccountService.create).not.toHaveBeenCalled();
        });

        it('should not invoke paymentProviderService.createBankAccount()', () => {
          expect(
            paymentProviderService.createBankAccount,
          ).not.toHaveBeenCalled();
        });

        it('should not invoke clientBankAccountRepository.save()', () => {
          expect(clientBankAccountRepository.save).not.toHaveBeenCalled();
        });

        it('should not invoke transactionService.createVerificationTransaction()', () => {
          expect(
            transactionService.createVerificationTransaction,
          ).not.toHaveBeenCalled();
        });

        it('should not invoke transactionService.createVerificationTransaction()', () => {
          expect(
            transactionService.createVerificationTransaction,
          ).not.toHaveBeenCalled();
        });
      });
    });
  });

  describe('getClientBankAccounts(idUserClient)', () => {
    let idUserClient;
    let expectedBankAccounts;
    let result;
    describe('case: success', () => {
      describe('when everything works well', () => {
        beforeEach(async () => {
          idUserClient = 1;
          expectedBankAccounts = Array(expectedBankAccount);

          (bankAccountRepository.find as jest.Mock).mockResolvedValue(
            expectedBankAccounts,
          );

          result = await clientBankAccountService.getClientBankAccounts(
            idUserClient,
          );
        });

        it('should invoke bankAccountRepository.find()', () => {
          expect(bankAccountRepository.find).toHaveBeenCalledTimes(1);
          expect(bankAccountRepository.find).toHaveBeenCalledWith({
            where: `"userClient"."idUserClient" ='${idUserClient}' and "stateBankAccount"."finalDate" is null and state.name != '${StateName.CANCELLED}'`,
            join: {
              alias: 'bankAccount',
              innerJoinAndSelect: {
                clientBankAccount: 'bankAccount.clientBankAccount',
                stateBankAccount: 'clientBankAccount.stateBankAccount',
                userClient: 'clientBankAccount.userClient',
                state: 'stateBankAccount.state',
                routingNumber: 'bankAccount.routingNumber',
                bank: 'routingNumber.bank',
              },
            },
          });
        });

        it('should return an array of bank accounts', () => {
          expect(result).toStrictEqual(expectedBankAccounts);
        });
      });
    });
    describe('case: failure', () => {
      let idUserClient;
      describe('When idUserClient is undefined', () => {
        beforeEach(async () => {
          idUserClient = undefined;

          (clientBankAccountRepository.find as jest.Mock).mockImplementation(
            () => {
              throw new Error('Error');
            },
          );

          result = await clientBankAccountService.getClientBankAccounts(
            idUserClient,
          );
        });

        it('should throw an error when client bank accounts are not found', () => {
          expect(clientBankAccountRepository.find).toThrow(new Error('Error'));
        });
      });
    });
  });

  describe('getOne(idUserClient,idBankAccount)', () => {
    let idUserClient: number;
    let idBankAccount: number;
    let result;
    describe('case: success', () => {
      describe('when everything works well', () => {
        beforeEach(async () => {
          idUserClient = 1;
          idBankAccount = 1;

          (clientBankAccountRepository.findOne as jest.Mock).mockResolvedValue(
            expectedClientBankAccount,
          );

          result = await clientBankAccountService.getOne(
            idUserClient,
            idBankAccount,
          );
        });

        it('should invoke clientBankAccountRepository.findOne()', () => {
          expect(clientBankAccountRepository.findOne).toHaveBeenCalledTimes(1);
          expect(clientBankAccountRepository.findOne).toHaveBeenCalledWith({
            where: `userClient.idUserClient = ${idUserClient} AND bankAccount.idBankAccount = ${idBankAccount}`,
            join: {
              alias: 'clientBankAccount',
              innerJoin: {
                bankAccount: 'clientBankAccount.bankAccount',
                userClient: 'clientBankAccount.userClient',
              },
            },
          });
        });

        it('should return a client bank account object', () => {
          expect(result).toStrictEqual(expectedClientBankAccount);
        });
      });
    });

    describe('case: failure', () => {
      describe('when idUserClient is undefined', () => {
        beforeEach(async () => {
          idUserClient = undefined;
          idBankAccount = 1;
          (clientBankAccountRepository.findOne as jest.Mock).mockImplementation(
            () => {
              throw new Error('Error');
            },
          );

          result = async () =>
            await clientBankAccountService.getOne(idUserClient, idBankAccount);
        });

        it('should throw an error when client bank account is not found', () => {
          expect(clientBankAccountRepository.findOne).toThrow(
            new Error('Error'),
          );
        });
      });

      describe('when idBankAccount is undefined', () => {
        beforeEach(async () => {
          idUserClient = 1;
          idBankAccount = undefined;

          (clientBankAccountRepository.findOne as jest.Mock).mockImplementation(
            () => {
              throw new Error('Error');
            },
          );

          result = async () =>
            await clientBankAccountService.getOne(idUserClient, idBankAccount);
        });

        it('should throw an error when client bank account is not found', async () => {
          expect(clientBankAccountRepository.findOne).toThrow(
            new Error('Error'),
          );
        });
      });
    });
  });

  describe('getByState(states)', () => {
    let states;
    let expectedBankAccounts;
    let result;

    describe('case: success', () => {
      describe('when everything works well', () => {
        beforeEach(async () => {
          states = ['active'];
          expectedBankAccounts = Array(expectedBankAccount);

          (clientBankAccountRepository.query as jest.Mock).mockResolvedValue(
            expectedBankAccounts,
          );

          result = await clientBankAccountService.getByState(states);
        });

        it('should invoke clientBankAccountRepository.query()', () => {
          expect(clientBankAccountRepository.query).toHaveBeenCalledTimes(1);
        });

        it('should return an array of bank accounts', () => {
          expect(result).toStrictEqual(expectedBankAccounts);
        });
      });
    });
  });

  describe('verify(clientBankAccountId,amounts)', () => {
    let clientBankAccountId;
    let amounts;
    let expectedCheckVerificationAmounts;
    let expectedChangeState;
    let expectedFirstTransactionState;
    let expectedSecondTransactionState;
    let expectedResult;
    let result;

    describe('case: success', () => {
      describe('when everything works well', () => {
        beforeEach(async () => {
          clientBankAccountId = 1;
          amounts = [1, 1.5];
          expectedCheckVerificationAmounts = true;

          expectedChangeState = expectedChangeBankAccount;

          expectedFirstTransactionState = {
            transaction: {
              idTransaction: 8,
              initialDate: '2020-08-09T20:06:28.661Z',
              rawAmount: '0.000',
              totalAmountWithInterest: '94.000',
              type: 'bankAccountValidation',
              operation: null,
              paymentProviderTransactionId: null,
              fk_transaction: null,
              fk_points_conversion: 1,
              fk_client_bank_account: 3,
              fk_client_on_third_party: null,
              idUserClient: 1,
            },
            description: 'CHANGE_VERIFICATION_TO_VALID',
            state: {
              idState: 5,
              name: 'valid',
              description:
                'This state indicates that the transaction has been made successful',
            },
            finalDate: null,
            idStateTransaction: 16,
            initialDate: '2020-08-09T20:06:46.240Z',
          };

          expectedSecondTransactionState = {
            transaction: {
              idTransaction: 8,
              initialDate: '2020-08-09T20:06:28.661Z',
              rawAmount: '0.000',
              totalAmountWithInterest: '94.000',
              type: 'bankAccountValidation',
              operation: null,
              paymentProviderTransactionId: null,
              fk_transaction: null,
              fk_points_conversion: 1,
              fk_client_bank_account: 3,
              fk_client_on_third_party: null,
              idUserClient: 1,
            },
            description: 'CHANGE_VERIFICATION_TO_VALID',
            state: {
              idState: 5,
              name: 'valid',
              description:
                'This state indicates that the transaction has been made successful',
            },
            finalDate: null,
            idStateTransaction: 16,
            initialDate: '2020-08-09T20:06:46.240Z',
          };

          (clientBankAccountRepository.findOne as jest.Mock).mockResolvedValue(
            expectedClientBankAccount,
          );

          jest
            .spyOn(clientBankAccountService, 'checkVerificationAmounts')
            .mockResolvedValue(expectedCheckVerificationAmounts);

          (paymentProviderService.verifyBankAccount as jest.Mock).mockResolvedValue(
            expectedVerification,
          );

          jest
            .spyOn(clientBankAccountService, 'changeState')
            .mockResolvedValue(expectedChangeState);

          (transactionService.getAllFiltered as jest.Mock).mockResolvedValue(
            expectedVerificationTransactions,
          );

          (stateTransactionService.update as jest.Mock).mockResolvedValue(
            expectedFirstTransactionState,
          );

          (stateTransactionService.update as jest.Mock).mockResolvedValue(
            expectedSecondTransactionState,
          );

          result = await clientBankAccountService.verify({
            clientBankAccountId,
            amounts,
          });
        });

        it('should invoke clientBankAccountRepository.findOne()', () => {
          expect(clientBankAccountRepository.findOne).toHaveBeenCalledTimes(1);
          expect(clientBankAccountRepository.findOne).toHaveBeenCalledWith({
            idClientBankAccount: clientBankAccountId,
          });
        });

        it('should invoke paymentProviderService.verifyBankAccount()', () => {
          expect(
            paymentProviderService.verifyBankAccount,
          ).toHaveBeenCalledTimes(1);
          expect(paymentProviderService.verifyBankAccount).toHaveBeenCalledWith(
            {
              customerId:
                expectedClientBankAccount.userClient.userDetails.customerId,
              bankAccountId: expectedClientBankAccount.chargeId,
              amounts,
            },
          );
        });

        it('should invoke transactionService.getAllFiltered()', () => {
          expect(transactionService.getAllFiltered).toHaveBeenCalledTimes(1);
          expect(transactionService.getAllFiltered).toHaveBeenCalledWith(
            [StateName.VERIFYING],
            [TransactionType.BANK_ACCOUNT_VALIDATION],
            [PaymentProvider.STRIPE],
            expectedClientBankAccount.idClientBankAccount,
            true,
          );
        });

        it('should invoke stateTransactionService.update()', () => {
          expect(stateTransactionService.update).toHaveBeenCalledTimes(2);
        });

        it('should invoke stateTransactionService.update() with amounts[0]', () => {
          expect(stateTransactionService.update).toHaveBeenCalledWith(
            StateName.VALID,
            expectedVerificationTransactions[0],
            StateDescription.CHANGE_VERIFICATION_TO_VALID,
          );
        });

        it('should invoke stateTransactionService.update() with amounts[1]', () => {
          expect(stateTransactionService.update).toHaveBeenCalledWith(
            StateName.VALID,
            expectedVerificationTransactions[1],
            StateDescription.CHANGE_VERIFICATION_TO_VALID,
          );
        });

        it('should return a Stripe Response', () => {
          const {
            id,
            account_holder_type,
            last4: accountNumber_last4,
            routing_number,
            customer,
            fingerprint,
            ...verification
          } = expectedVerification;

          expectedResult = {
            ...verification,
            accountNumber_last4,
          };
          expect(result).toStrictEqual(expectedResult);
        });
      });
    });

    describe('case: failure', () => {
      let expectedError;
      describe('when the verification amounts are invalid', () => {
        beforeEach(async () => {
          clientBankAccountId = 1;
          amounts = [1, 3.23];
          expectedCheckVerificationAmounts = false;

          jest
            .spyOn(clientBankAccountService, 'checkVerificationAmounts')
            .mockResolvedValue(expectedCheckVerificationAmounts);

          expectedError = new BadRequestException();

          jest
            .spyOn(clientBankAccountService, 'verify')
            .mockRejectedValue(expectedError);
        });

        it('should throw when the verification amounts is no valid', async () => {
          await expect(
            clientBankAccountService.verify({ clientBankAccountId, amounts }),
          ).rejects.toThrow(BadRequestException);
        });

        it('should not invoke paymentProviderService.verifyBankAccount()', () => {
          expect(
            paymentProviderService.verifyBankAccount,
          ).not.toHaveBeenCalled();
        });

        it('should not invoke transactionService.getAllFiltered()', () => {
          expect(transactionService.getAllFiltered).not.toHaveBeenCalled();
        });

        it('should not invoke stateTransactionService.update()', () => {
          expect(stateTransactionService.update).not.toHaveBeenCalled();
        });
      });
    });
  });

  describe('checkVerificationAmounts(clientBankAccount, amounts)', () => {
    describe('case: success', () => {
      let correctValues = true;
      let clientBankAccount;
      let amounts;
      let result;

      describe('when everything works well', () => {
        beforeEach(async () => {
          clientBankAccount = 1;
          amounts = [1, 1.5];

          (transactionService.getClientBankAccountTransaction as jest.Mock).mockResolvedValue(
            expectedTransactions,
          );

          result = await clientBankAccountService.checkVerificationAmounts(
            clientBankAccount,
            amounts,
          );
        });

        it('should invoke transactionService.getClientBankAccountTransaction()', () => {
          expect(
            transactionService.getClientBankAccountTransaction,
          ).toHaveBeenCalledTimes(1);
          expect(
            transactionService.getClientBankAccountTransaction,
          ).toHaveBeenCalledWith(clientBankAccount);
        });
        it('should return true', () => {
          expect(result).toStrictEqual(correctValues);
        });
      });
    });

    describe('case: failure', () => {
      let correctValues = false;
      let clientBankAccount;
      let amounts;
      let result;

      describe('when amounts are no valid', () => {
        beforeEach(async () => {
          clientBankAccount = 1;
          amounts = [0.7, 1.1];

          (transactionService.getClientBankAccountTransaction as jest.Mock).mockResolvedValue(
            expectedTransactions,
          );

          result = await clientBankAccountService.checkVerificationAmounts(
            clientBankAccount,
            amounts,
          );
        });

        it('transactionService.getClientBankAccountTransaction()', () => {
          expect(
            transactionService.getClientBankAccountTransaction,
          ).toHaveBeenCalledTimes(1);
          expect(
            transactionService.getClientBankAccountTransaction,
          ).toHaveBeenCalledWith(clientBankAccount);
        });
        it('should return a false', () => {
          expect(result).toStrictEqual(correctValues);
        });
      });

      describe('when amounts.lenght = 0', () => {
        beforeEach(async () => {
          clientBankAccount = 1;
          amounts = [];

          (transactionService.getClientBankAccountTransaction as jest.Mock).mockResolvedValue(
            expectedTransactions,
          );

          result = await clientBankAccountService.checkVerificationAmounts(
            clientBankAccount,
            amounts,
          );
        });

        it('transactionService.getClientBankAccountTransaction()', () => {
          expect(
            transactionService.getClientBankAccountTransaction,
          ).toHaveBeenCalledTimes(1);
          expect(
            transactionService.getClientBankAccountTransaction,
          ).toHaveBeenCalledWith(clientBankAccount);
        });
        it('should return a false', () => {
          expect(result).toStrictEqual(correctValues);
        });
      });

      describe('when amounts.lenght = 1', () => {
        beforeEach(async () => {
          clientBankAccount = 1;
          amounts = [1.6];

          (transactionService.getClientBankAccountTransaction as jest.Mock).mockResolvedValue(
            expectedTransactions,
          );

          result = await clientBankAccountService.checkVerificationAmounts(
            clientBankAccount,
            amounts,
          );
        });

        it('transactionService.getClientBankAccountTransaction()', () => {
          expect(
            transactionService.getClientBankAccountTransaction,
          ).toHaveBeenCalledTimes(1);
          expect(
            transactionService.getClientBankAccountTransaction,
          ).toHaveBeenCalledWith(clientBankAccount);
        });
        it('should return a false', () => {
          expect(result).toStrictEqual(correctValues);
        });
      });
    });
  });

  describe('updateState(idClientBankAccount, state, description)', () => {
    let expectedChangeState;
    let idClientBankAccount;
    let state;
    let description;
    let result;

    describe('case: success', () => {
      describe('when everything works well', () => {
        beforeEach(async () => {
          idClientBankAccount = 3;
          state = StateName.ACTIVE;
          description =
            'This state indicates that the object is ready to be used';

          expectedChangeState = expectedChangeBankAccount;

          (clientBankAccountRepository.findOne as jest.Mock).mockResolvedValue(
            expectedClientBankAccount,
          );

          jest
            .spyOn(clientBankAccountService, 'changeState')
            .mockResolvedValue(expectedChangeState);

          result = await clientBankAccountService.updateState(
            idClientBankAccount,
            state,
            description,
          );
        });

        it('should invoke clientBankAccountRepository.findOne()', () => {
          expect(clientBankAccountRepository.findOne).toHaveBeenCalledTimes(1);
          expect(clientBankAccountRepository.findOne).toHaveBeenCalledWith({
            idClientBankAccount,
          });
        });
        it('should return a active state bank account object', () => {
          expect(result).toStrictEqual(expectedChangeState);
        });
      });

      describe('when description is null', () => {
        beforeEach(async () => {
          idClientBankAccount = 3;
          state = StateName.ACTIVE;

          expectedChangeState = { ...expectedChangeBankAccount };
          expectedChangeState.state.description = null;

          (clientBankAccountRepository.findOne as jest.Mock).mockResolvedValue(
            expectedClientBankAccount,
          );

          jest
            .spyOn(clientBankAccountService, 'changeState')
            .mockResolvedValue(expectedChangeState);

          result = await clientBankAccountService.updateState(
            idClientBankAccount,
            state,
            null,
          );
        });

        it('should invoke clientBankAccountRepository.findOne()', () => {
          expect(clientBankAccountRepository.findOne).toHaveBeenCalledTimes(1);
          expect(clientBankAccountRepository.findOne).toHaveBeenCalledWith({
            idClientBankAccount,
          });
        });
        it('should return a active state bank account object', () => {
          expect(result).toStrictEqual(expectedChangeState);
        });
      });
    });
  });

  describe('cancelBankAccount(idUserClient, idBankAccount, email)', () => {
    let clientBankAccount;
    let expectedHasPendingTransaction;
    let expectedChangeState;
    let idUserClient;
    let idBankAccount;
    let email;
    describe('case: success', () => {
      describe('when everything works well', () => {
        beforeEach(async () => {
          expectedChangeState = expectedChangeBankAccount;
          expectedHasPendingTransaction = false;
          clientBankAccount = expectedClientBankAccount;
          idUserClient = 1;
          idBankAccount = 3;
          email = 'test@petromiles.com';

          jest
            .spyOn(clientBankAccountService, 'getOne')
            .mockResolvedValue(clientBankAccount);

          jest
            .spyOn<any, string>(
              clientBankAccountService,
              'hasPendingTransaction',
            )
            .mockImplementation(() => {
              return expectedHasPendingTransaction;
            });

          jest
            .spyOn(clientBankAccountService, 'changeState')
            .mockResolvedValue(expectedChangeState);

          paymentProviderService.deleteBankAccount as jest.Mock;

          await clientBankAccountService.cancelBankAccount(
            idUserClient,
            idBankAccount,
            email,
          );
        });

        it('should invoke paymentProviderService.deleteBankAccount()', () => {
          expect(
            paymentProviderService.deleteBankAccount,
          ).toHaveBeenCalledTimes(1);
          expect(paymentProviderService.deleteBankAccount).toHaveBeenCalledWith(
            clientBankAccount.userClient.userDetails.customerId,
            clientBankAccount.chargeId,
            email,
          );
        });
      });
    });

    describe('case: failure', () => {
      describe('when user has pending transactions', () => {
        let expectedError: BadRequestException;
        beforeEach(async () => {
          clientBankAccount = expectedClientBankAccount;
          idUserClient = 1;
          idBankAccount = 3;
          expectedHasPendingTransaction = true;
          email = 'test@petromiles.com';

          jest
            .spyOn(clientBankAccountService, 'getOne')
            .mockResolvedValue(clientBankAccount);

          jest
            .spyOn<any, string>(
              clientBankAccountService,
              'hasPendingTransaction',
            )
            .mockResolvedValue(expectedHasPendingTransaction);

          expectedError = new BadRequestException();

          jest
            .spyOn(clientBankAccountService, 'cancelBankAccount')
            .mockRejectedValue(expectedError);
        });

        it('should throw when the user has pending transactions', async () => {
          await expect(
            clientBankAccountService.cancelBankAccount(
              idUserClient,
              idBankAccount,
              email,
            ),
          ).rejects.toThrow(BadRequestException);
        });

        it('should not invoke paymentProviderService.deleteBankAccount()', () => {
          expect(
            paymentProviderService.deleteBankAccount,
          ).not.toHaveBeenCalled();
        });
      });
    });
  });

  describe('nicknameIsTaken(nickname,idUserClient)', () => {
    let expectedBankAccounts;
    let nickname;
    let idUserClient;
    let result;
    describe('case: success', () => {
      describe('nickname is not taken', () => {
        beforeEach(async () => {
          expectedBankAccounts = Array(expectedBankAccount);
          nickname = 'test 1';
          idUserClient = 1;

          jest
            .spyOn(clientBankAccountService, 'getClientBankAccounts')
            .mockResolvedValue(expectedBankAccounts);

          result = await clientBankAccountService.nicknameIsTaken(
            nickname,
            idUserClient,
          );
        });

        it('should invoke clientBankAccountService.getClientBankAccounts()', () => {
          expect(
            clientBankAccountService.getClientBankAccounts,
          ).toHaveBeenCalledTimes(1);
          expect(
            clientBankAccountService.getClientBankAccounts,
          ).toHaveBeenCalledWith(idUserClient);
        });

        it('should return false', () => {
          expect(result).toStrictEqual(false);
        });
      });
    });
    describe('case: failure', () => {
      describe('nickname is taken', () => {
        beforeEach(async () => {
          expectedBankAccounts = Array(expectedBankAccount);
          nickname = 'test';
          idUserClient = 1;

          jest
            .spyOn(clientBankAccountService, 'getClientBankAccounts')
            .mockResolvedValue(expectedBankAccounts);

          result = await clientBankAccountService.nicknameIsTaken(
            nickname,
            idUserClient,
          );
        });

        it('should invoke clientBankAccountService.getClientBankAccounts()', () => {
          expect(
            clientBankAccountService.getClientBankAccounts,
          ).toHaveBeenCalledTimes(1);
          expect(
            clientBankAccountService.getClientBankAccounts,
          ).toHaveBeenCalledWith(idUserClient);
        });

        it('should return true', () => {
          expect(result).toStrictEqual(true);
        });
      });
    });
  });
  describe('updatePrimary(clientBankAccount,primary)', () => {
    let clientBankAccount;
    let expectedPrimaryClientBankAccount;
    let result;
    describe('case: success', () => {
      describe('with primary = true', () => {
        beforeEach(async () => {
          clientBankAccount = {
            idClientBankAccount: 3,
            paymentProvider: 'STRIPE',
            chargeId: 'ba_1HEKmkDfwU0tej1wAWeUIPNN',
            primary: false,
            transferId: 'ba_1HEKmmJPZXGZidTbJQlcIAOw',
            userClient: {
              idUserClient: 1,
              salt: '$2b$10$yWGg/CN1MIr.kWNeeKDDDO',
              googleToken: null,
              facebookToken: null,
              email: 'test@petromiles.com',
              password:
                '$2b$10$yWGg/CN1MIr.kWNeeKDDDO3W9aq2g0K/d1JOG8iPTrIokXtUEDze2',
              stateUser,
              userDetails,
              userSuscription,
            },
            bankAccount,
            stateBankAccount,
          };
          expectedPrimaryClientBankAccount = expectedClientBankAccount;
          expectedPrimaryClientBankAccount.primary = true;
          (clientBankAccountRepository.save as jest.Mock).mockResolvedValue(
            expectedPrimaryClientBankAccount,
          );

          result = await clientBankAccountService.updatePrimary(
            clientBankAccount,
            true,
          );
        });

        it('should return a client bank account with property primary = true', () => {
          expect(result).toStrictEqual(expectedPrimaryClientBankAccount);
        });
      });

      describe('with primary = false', () => {
        beforeEach(async () => {
          clientBankAccount = {
            idClientBankAccount: 3,
            paymentProvider: 'STRIPE',
            chargeId: 'ba_1HEKmkDfwU0tej1wAWeUIPNN',
            primary: false,
            transferId: 'ba_1HEKmmJPZXGZidTbJQlcIAOw',
            userClient: {
              idUserClient: 1,
              salt: '$2b$10$yWGg/CN1MIr.kWNeeKDDDO',
              googleToken: null,
              facebookToken: null,
              email: 'test@petromiles.com',
              password:
                '$2b$10$yWGg/CN1MIr.kWNeeKDDDO3W9aq2g0K/d1JOG8iPTrIokXtUEDze2',
              stateUser,
              userDetails,
              userSuscription,
            },
            bankAccount,
            stateBankAccount,
          };
          expectedPrimaryClientBankAccount = expectedClientBankAccount;
          expectedPrimaryClientBankAccount.primary = false;
          (clientBankAccountRepository.save as jest.Mock).mockResolvedValue(
            expectedPrimaryClientBankAccount,
          );

          result = await clientBankAccountService.updatePrimary(
            clientBankAccount,
            false,
          );
        });

        it('should return a client bank account with property primary = false', () => {
          expect(result).toStrictEqual(expectedPrimaryClientBankAccount);
        });
      });
    });
  });
  describe('updateAccountState(updateAccountStateDto)', () => {
    let updateAccountStateDTO;
    let expectedHasPendingTransaction;
    let expectedNewBankAccountState;
    let result;
    let expectedCBA;

    describe('case: success', () => {
      describe('when the new state is BLOCKED', () => {
        beforeEach(async () => {
          updateAccountStateDTO = {
            idUserClient: 1,
            idBankAccount: 1,
            state: StateName.BLOCKED,
          };
          expectedCBA = expectedClientBankAccount;
          expectedHasPendingTransaction = false;
          expectedNewBankAccountState = {
            idStateBankAccount: 1,
            initialDate: new Date(),
            finalDate: null,
            description: StateDescription.BANK_ACCOUNT_BLOCKED,
          };

          jest
            .spyOn(clientBankAccountService, 'getOne')
            .mockResolvedValue(expectedCBA);

          jest
            .spyOn(clientBankAccountService, 'hasPendingTransaction')
            .mockResolvedValue(false);

          jest
            .spyOn(clientBankAccountService, 'changeState')
            .mockResolvedValue(expectedNewBankAccountState);

          result = await clientBankAccountService.updateAccountState(
            updateAccountStateDTO,
          );
        });

        it('should return a state bank account with a state = blocked', () => {
          expect(result).toStrictEqual(expectedNewBankAccountState);
        });
      });
      describe('when the new state is ACTIVE', () => {
        beforeEach(async () => {
          updateAccountStateDTO = {
            idUserClient: 1,
            idBankAccount: 1,
            state: StateName.ACTIVE,
          };
          expectedCBA = expectedClientBankAccount;
          expectedHasPendingTransaction = false;
          expectedNewBankAccountState = {
            idStateBankAccount: 1,
            initialDate: new Date(),
            finalDate: null,
            description: StateDescription.BANK_ACCOUNT_ACTIVATED,
          };

          jest
            .spyOn(clientBankAccountService, 'getOne')
            .mockResolvedValue(expectedCBA);

          jest
            .spyOn(clientBankAccountService, 'hasPendingTransaction')
            .mockResolvedValue(false);

          jest
            .spyOn(clientBankAccountService, 'changeState')
            .mockResolvedValue(expectedNewBankAccountState);

          result = await clientBankAccountService.updateAccountState(
            updateAccountStateDTO,
          );
        });

        it('should return a state bank account with a state = active', () => {
          expect(result).toStrictEqual(expectedNewBankAccountState);
        });
      });
    });

    describe('case: failure', () => {
      let expectedError: BadRequestException;
      describe('user has pending transactions', () => {
        beforeEach(async () => {
          updateAccountStateDTO = {
            idUserClient: 1,
            idBankAccount: 1,
            state: StateName.BLOCKED,
          };
          expectedCBA = expectedClientBankAccount;
          expectedHasPendingTransaction = true;
          jest
            .spyOn(clientBankAccountService, 'getOne')
            .mockResolvedValue(expectedCBA);

          jest
            .spyOn<any, string>(
              clientBankAccountService,
              'hasPendingTransaction',
            )
            .mockResolvedValue(expectedHasPendingTransaction);

          expectedError = new BadRequestException();

          jest
            .spyOn(clientBankAccountService, 'updateAccountState')
            .mockRejectedValue(expectedError);
        });
        it('should throw when the user has pending transactions', async () => {
          await expect(
            clientBankAccountService.updateAccountState(updateAccountStateDTO),
          ).rejects.toThrow(BadRequestException);
        });
      });
    });
  });

  describe('updateCurrentPrimary(updatePrimaryAccountDTO,idUserClient)', () => {
    let updatePrimaryAccountDTO;
    let idUserClient;
    let result;
    describe('case: success', () => {
      let expectedCBA;
      let expectedBA;
      describe('when user change to primary account', () => {
        beforeEach(async () => {
          updatePrimaryAccountDTO = {
            primary: true,
            idBankAccount: 1,
          };
          idUserClient = 1;
          expectedCBA = { ...expectedClientBankAccount };
          expectedCBA.primary = true;
          expectedBA = expectedBankAccount;

          (clientBankAccountRepository.findOne as jest.Mock).mockResolvedValue(
            expectedCBA,
          );

          (bankAccountRepository.findOne as jest.Mock).mockResolvedValue(
            expectedBA,
          );

          jest
            .spyOn(clientBankAccountService, 'updatePrimary')
            .mockResolvedValue(expectedCBA);

          result = await clientBankAccountService.updateCurrentPrimary(
            updatePrimaryAccountDTO,
            idUserClient,
          );
        });

        it('should invoke clientBankAccountRepository.findOne()', () => {
          expect(clientBankAccountRepository.findOne).toHaveBeenCalledTimes(2);
        });
        it('should invoke bankAccountRepository.findOne()', () => {
          expect(bankAccountRepository.findOne).toHaveBeenCalledTimes(1);
          expect(bankAccountRepository.findOne).toHaveBeenCalledWith({
            idBankAccount: updatePrimaryAccountDTO.idBankAccount,
          });
        });
        it('should return a primary client bank account', () => {
          expect(result).toStrictEqual(expectedCBA);
        });
      });

      describe('when user change to not primary account', () => {
        beforeEach(async () => {
          updatePrimaryAccountDTO = {
            primary: false,
            idBankAccount: 1,
          };
          idUserClient = 1;
          expectedCBA = { ...expectedClientBankAccount };
          expectedCBA.primary = false;
          expectedBA = expectedBankAccount;

          (clientBankAccountRepository.findOne as jest.Mock).mockResolvedValue(
            expectedCBA,
          );

          (bankAccountRepository.findOne as jest.Mock).mockResolvedValue(
            expectedBA,
          );

          jest
            .spyOn(clientBankAccountService, 'updatePrimary')
            .mockResolvedValue(expectedCBA);

          result = await clientBankAccountService.updateCurrentPrimary(
            updatePrimaryAccountDTO,
            idUserClient,
          );
        });

        it('should invoke clientBankAccountRepository.findOne()', () => {
          expect(clientBankAccountRepository.findOne).toHaveBeenCalledTimes(1);
          expect(clientBankAccountRepository.findOne).toHaveBeenCalledWith({
            bankAccount: expectedBA,
          });
        });
        it('should invoke bankAccountRepository.findOne()', () => {
          expect(bankAccountRepository.findOne).toHaveBeenCalledTimes(1);
          expect(bankAccountRepository.findOne).toHaveBeenCalledWith({
            idBankAccount: updatePrimaryAccountDTO.idBankAccount,
          });
        });
        it('should return a not primary client bank account', () => {
          expect(result).toStrictEqual(expectedCBA);
        });
      });
    });
  });
});
