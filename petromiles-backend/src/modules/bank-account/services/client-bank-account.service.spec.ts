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
    let expectedUserClient;
    let expectedBankAccount;
    let expectedPaymentProviderBankAccount;
    let expectedClientBankAccount;
    let expectedVerificationTransaction;
    let expectedChangeState;
    let result;

    describe('case: success', () => {
      describe('when everything works well', () => {
        beforeEach(async () => {
          bankAccountCreateParams = {
            routingNumber: '121000358',
            type: 'Checking',
            accountNumber: '000123456789',
            checkNumber: '1234',
            nickname: 'test 9',
            bank: {
              idBank: 1,
              name: 'Bank of America',
              photo:
                'https://firebasestorage.googleapis.com/v0/b/petromiles-f04cc.appspot.com/o/banks%2FBank%20of%20America.png?alt=media&token=84f6581d-cffe-47e7-a846-0b185460cc44',
              country: { idCountry: 1, name: 'UNITED STATES' },
            },
            userDetails: {
              firstName: 'petro',
              lastName: 'miles',
              email: 'test@petromiles.com',
              phone: '123456',
            },
          };

          user = { email: 'test@petromiles.com', id: 1, role: 'CLIENT' };

          expectedNicknameIsTaken = false;

          expectedUserClient = {
            idUserClient: 1,
            salt: '$2b$10$4WQNzcG4y7h864.R8X3Pxu',
            googleToken: null,
            facebookToken: null,
            email: 'alleyne.michelle333@hotmail.com',
            password:
              '$2b$10$4WQNzcG4y7h864.R8X3PxuV5scq/pm1RX3yPfy.j4iBtS/RUvBTn2',
            stateUser: [
              {
                idStateUser: 2,
                initialDate: '2020-08-08T01:07:29.899Z',
                finalDate: null,
                description: null,
                state: {
                  idState: 1,
                  name: 'active',
                  description:
                    'This state indicates that the object is ready to be used',
                },
              },
            ],
            userDetails: {
              idUserDetails: 2,
              firstName: 'michelle',
              middleName: null,
              lastName: 'alleyne',
              secondLastName: null,
              birthdate: null,
              address: null,
              phone: null,
              photo: null,
              customerId: 'cus_HnH5q9EbgFVsVZ',
              accountId: 'acct_1HDgX2G8HeGWvCPH',
              language: { idLanguage: 1, name: 'english', shortname: 'en' },
              country: null,
            },
            userSuscription: [
              {
                idUserSuscription: 1,
                initialDate: '2020-08-08T01:07:29.940Z',
                upgradedAmount: 0,
                finalDate: null,
                suscription: {
                  idSuscription: 1,
                  name: 'BASIC',
                  cost: 0,
                  upgradedAmount: null,
                  description: 'Suscription initial of every new client',
                },
              },
            ],
          };

          expectedBankAccount = {
            accountNumber: '000123456789',
            checkNumber: '1234',
            nickname: 'test 5',
            type: 'Checking',
            userDetails: {
              idUserDetails: 6,
              firstName: 'petro',
              middleName: null,
              lastName: 'miles',
              secondLastName: null,
              birthdate: null,
              address: null,
              phone: '12345',
              photo: null,
              customerId: null,
              accountId: null,
              userClient: null,
            },
            routingNumber: {
              idRoutingNumber: 1,
              number: '124003116',
              bank: {
                idBank: 2,
                name: 'Ally Bank',
                photo:
                  'https://firebasestorage.googleapis.com/v0/b/petromiles-f04cc.appspot.com/o/banks%2FAlly%20Bank.png?alt=media&token=a5063494-5235-4fcd-8bbb-cc0ead5ea862',
                country: { idCountry: 1, name: 'UNITED STATES' },
              },
            },
            idBankAccount: 4,
          };

          expectedPaymentProviderBankAccount = {
            transferId: 'ba_1HDsZkAT8OF6QY3PkYrXsXOW',
            chargeId: 'ba_1HDsZiDfwU0tej1wIaM46rN4',
          };

          expectedClientBankAccount = {
            bankAccount: {
              accountNumber: '000123456789',
              checkNumber: '1234',
              nickname: 'test 5',
              type: 'Checking',
              userDetails: {
                idUserDetails: 6,
                firstName: 'petro',
                middleName: null,
                lastName: 'miles',
                secondLastName: null,
                birthdate: null,
                address: null,
                phone: '12345',
                photo: null,
                customerId: null,
                accountId: null,
                userClient: null,
              },
              routingNumber: {
                idRoutingNumber: 1,
                number: '124003116',
                bank: {
                  idBank: 2,
                  name: 'Ally Bank',
                  photo:
                    'https://firebasestorage.googleapis.com/v0/b/petromiles-f04cc.appspot.com/o/banks%2FAlly%20Bank.png?alt=media&token=a5063494-5235-4fcd-8bbb-cc0ead5ea862',
                  country: { idCountry: 1, name: 'UNITED STATES' },
                },
              },
              idBankAccount: 4,
            },
            userClient: {
              idUserClient: 1,
              salt: '$2b$10$p3OjA33PAfndN9rC1LBlfe',
              googleToken: null,
              facebookToken: null,
              email: 'test@petromiles.com',
              password:
                '$2b$10$p3OjA33PAfndN9rC1LBlfeG3dKutdB1eY4odnyfbzUGKVmVY4JFqO',
              stateUser: [
                {
                  idStateUser: 2,
                  initialDate: '2020-08-08T04:38:07.095Z',
                  finalDate: null,
                  description: null,
                  state: {
                    idState: 1,
                    name: 'active',
                    description:
                      'This state indicates that the object is ready to be used',
                  },
                },
              ],
              userDetails: {
                idUserDetails: 2,
                firstName: 'petro',
                middleName: null,
                lastName: 'miles',
                secondLastName: null,
                birthdate: null,
                address: null,
                phone: null,
                photo: null,
                customerId: 'cus_HnKTQxWH43d4sg',
                accountId: 'acct_1HDjonAT8OF6QY3P',
                language: { idLanguage: 1, name: 'english', shortname: 'en' },
                country: null,
              },
              userSuscription: [
                {
                  idUserSuscription: 1,
                  initialDate: '2020-08-08T04:38:07.130Z',
                  upgradedAmount: 0,
                  finalDate: null,
                  suscription: {
                    idSuscription: 1,
                    name: 'BASIC',
                    cost: 0,
                    upgradedAmount: null,
                    description: 'Suscription initial of every new client',
                  },
                },
              ],
            },
            transferId: 'ba_1HDsZkAT8OF6QY3PkYrXsXOW',
            chargeId: 'ba_1HDsZiDfwU0tej1wIaM46rN4',
            paymentProvider: 'STRIPE',
            primary: false,
            idClientBankAccount: 2,
          };

          expectedChangeState = {
            clientBankAccount: {
              bankAccount: {
                accountNumber: '000123456789',
                checkNumber: '1234',
                nickname: 'test 5',
                type: 'Checking',
                userDetails: {
                  idUserDetails: 6,
                  firstName: 'petro',
                  middleName: null,
                  lastName: 'miles',
                  secondLastName: null,
                  birthdate: null,
                  address: null,
                  phone: '12345',
                  photo: null,
                  customerId: null,
                  accountId: null,
                  userClient: null,
                },
                routingNumber: {
                  idRoutingNumber: 1,
                  number: '124003116',
                  bank: {
                    idBank: 2,
                    name: 'Ally Bank',
                    photo:
                      'https://firebasestorage.googleapis.com/v0/b/petromiles-f04cc.appspot.com/o/banks%2FAlly%20Bank.png?alt=media&token=a5063494-5235-4fcd-8bbb-cc0ead5ea862',
                    country: { idCountry: 1, name: 'UNITED STATES' },
                  },
                },
                idBankAccount: 4,
              },
              userClient: {
                idUserClient: 1,
                salt: '$2b$10$p3OjA33PAfndN9rC1LBlfe',
                googleToken: null,
                facebookToken: null,
                email: 'test@petromiles.com',
                password:
                  '$2b$10$p3OjA33PAfndN9rC1LBlfeG3dKutdB1eY4odnyfbzUGKVmVY4JFqO',
                stateUser: [
                  {
                    idStateUser: 2,
                    initialDate: '2020-08-08T04:38:07.095Z',
                    finalDate: null,
                    description: null,
                    state: {
                      idState: 1,
                      name: 'active',
                      description:
                        'This state indicates that the object is ready to be used',
                    },
                  },
                ],
                userDetails: {
                  idUserDetails: 2,
                  firstName: 'petro',
                  middleName: null,
                  lastName: 'miles',
                  secondLastName: null,
                  birthdate: null,
                  address: null,
                  phone: null,
                  photo: null,
                  customerId: 'cus_HnKTQxWH43d4sg',
                  accountId: 'acct_1HDjonAT8OF6QY3P',
                  language: { idLanguage: 1, name: 'english', shortname: 'en' },
                  country: null,
                },
                userSuscription: [
                  {
                    idUserSuscription: 1,
                    initialDate: '2020-08-08T04:38:07.130Z',
                    upgradedAmount: 0,
                    finalDate: null,
                    suscription: {
                      idSuscription: 1,
                      name: 'BASIC',
                      cost: 0,
                      upgradedAmount: null,
                      description: 'Suscription initial of every new client',
                    },
                  },
                ],
              },
              transferId: 'ba_1HDsZkAT8OF6QY3PkYrXsXOW',
              chargeId: 'ba_1HDsZiDfwU0tej1wIaM46rN4',
              paymentProvider: 'STRIPE',
              primary: false,
              idClientBankAccount: 2,
            },
            description: 'NEWLY_CREATED_ACCOUNT',
            state: {
              idState: 2,
              name: 'verifying',
              description:
                'This state indicates that the object is in the verification process',
            },
            finalDate: null,
            idStateBankAccount: 2,
            initialDate: '2020-08-08T13:59:09.927Z',
          };

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

        it('should return a transaction', () => {
          expect(result).toStrictEqual(expectedClientBankAccount);
        });
      });
    });

    describe('case: failure', () => {
      let expectedError: BadRequestException;
      describe('when nickname is taken', () => {
        beforeEach(() => {
          expectedNicknameIsTaken = true;

          bankAccountCreateParams = {
            routingNumber: '121000358',
            type: 'Checking',
            accountNumber: '000123456789',
            checkNumber: '1234',
            nickname: 'test 9',
            bank: {
              idBank: 1,
              name: 'Bank of America',
              photo:
                'https://firebasestorage.googleapis.com/v0/b/petromiles-f04cc.appspot.com/o/banks%2FBank%20of%20America.png?alt=media&token=84f6581d-cffe-47e7-a846-0b185460cc44',
              country: { idCountry: 1, name: 'UNITED STATES' },
            },
            userDetails: {
              firstName: 'petro',
              lastName: 'miles',
              email: 'test@petromiles.com',
              phone: '123456',
            },
          };

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
});
