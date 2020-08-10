import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException } from '@nestjs/common';

import { Repository } from 'typeorm';
import { WinstonModule } from 'nest-winston';

import createOptions from '@/logger/winston/winston-config';

import { BankAccountService } from '@/modules/bank-account/services/bank-account.service';
import { UserClientService } from '@/modules/user/services/user-client.service';

import { BankAccount } from '@/entities/bank-account.entity';
import { RoutingNumber } from '@/entities/routing-number.entity';

import { Bank } from '@/enums/bank.enum';

describe('BankAccountService', () => {
  let bankAccountService: BankAccountService;
  let RepositoryMock: jest.Mock;
  let bankAccountRepository: Repository<BankAccount>;
  let routingNumberRepository: Repository<RoutingNumber>;
  let UserClientServiceMock: jest.Mock<Partial<UserClientService>>;
  let userClientService: UserClientService;
  let execute: jest.Mock;

  beforeEach(() => {
    let select = jest.fn().mockReturnThis();
    let addSelect = jest.fn().mockReturnThis();
    let distinct = jest.fn().mockReturnThis();
    let leftJoin = jest.fn().mockReturnThis();
    let where = jest.fn().mockReturnThis();
    let andWhere = jest.fn().mockReturnThis();
    execute = jest.fn().mockReturnThis();

    RepositoryMock = jest.fn(() => ({
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      query: jest.fn(),
      createQueryBuilder: jest.fn(() => ({
        select,
        addSelect,
        distinct,
        leftJoin,
        where,
        andWhere,
        execute,
      })),
    }));

    UserClientServiceMock = jest.fn<
      Partial<UserClientService>,
      UserClientService[]
    >(() => ({
      createDetails: jest.fn(),
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
        BankAccountService,
        {
          provide: getRepositoryToken(BankAccount),
          useClass: RepositoryMock,
        },
        {
          provide: getRepositoryToken(RoutingNumber),
          useClass: RepositoryMock,
        },
        {
          provide: UserClientService,
          useClass: UserClientServiceMock,
        },
      ],
    }).compile();

    bankAccountService = module.get<BankAccountService>(BankAccountService);
    bankAccountRepository = module.get(getRepositoryToken(BankAccount));
    routingNumberRepository = module.get(getRepositoryToken(RoutingNumber));
    userClientService = module.get<UserClientService>(UserClientService);
  });

  describe('getAll()', () => {
    let expectedBankAccounts;
    let result;

    describe('case: success', () => {
      describe('when everything works well', () => {
        beforeEach(async () => {
          expectedBankAccounts = [
            {
              idBankAccount: 1,
              accountNumber: '000123456789',
              checkNumber: '2245',
              nickname: 'test 1',
              type: 'Saving',
              routingNumber: {
                idRoutingNumber: 2,
                number: '082000073',
                bank: {
                  idBank: 1,
                  name: 'Bank of America',
                  photo:
                    'https://firebasestorage.googleapis.com/v0/b/petromiles-f04cc.appspot.com/o/banks%2FBank%20of%20America.png?alt=media&token=84f6581d-cffe-47e7-a846-0b185460cc44',
                  country: { idCountry: 1, name: 'UNITED STATES' },
                },
              },
            },
          ];

          (bankAccountRepository.find as jest.Mock).mockResolvedValue(
            expectedBankAccounts,
          );

          result = await bankAccountService.getAll();
        });

        it('should invoke bankAccountRepository.find()', () => {
          expect(bankAccountRepository.find).toHaveBeenCalledTimes(1);
        });

        it('should return an array of bankAccounts', () => {
          expect(result).toStrictEqual(expectedBankAccounts);
        });
      });
    });
  });

  describe('getValidRoutingNumber(number, bank)', () => {
    let number;
    let bank;
    let expectedRoutingNumberFound;
    let result;

    describe('case: success', () => {
      describe('when everything works well', () => {
        beforeEach(async () => {
          number = '124003116';

          bank = {
            idBank: 2,
            name: Bank.ALLY_BANK,
            photo:
              'https://firebasestorage.googleapis.com/v0/b/petromiles-f04cc.appspot.com/o/banks%2FAlly%20Bank.png?alt=media&token=a5063494-5235-4fcd-8bbb-cc0ead5ea862',
            country: { idCountry: 1, name: 'UNITED STATES' },
          };

          expectedRoutingNumberFound = {
            idRoutingNumber: 1,
            number: '124003116',
            bank: {
              idBank: 2,
              name: Bank.ALLY_BANK,
              photo:
                'https://firebasestorage.googleapis.com/v0/b/petromiles-f04cc.appspot.com/o/banks%2FAlly%20Bank.png?alt=media&token=a5063494-5235-4fcd-8bbb-cc0ead5ea862',
              country: { idCountry: 1, name: 'UNITED STATES' },
            },
          };

          (routingNumberRepository.findOne as jest.Mock).mockResolvedValue(
            expectedRoutingNumberFound,
          );

          result = await bankAccountService.getValidRoutingNumber(number, bank);
        });
        it('should invoke routingNumberRepository.findOne()', () => {
          expect(routingNumberRepository.findOne).toHaveBeenCalledTimes(1);
          expect(routingNumberRepository.findOne).toHaveBeenCalledWith({
            number,
            bank,
          });
        });

        it('should return a routing number', () => {
          expect(result).toStrictEqual(expectedRoutingNumberFound);
        });
      });
    });

    describe('case: failure', () => {
      let expectedError: BadRequestException;
      describe('When routing number does not match with the bank', () => {
        beforeEach(async () => {
          number = '011900571';

          bank = {
            idBank: 2,
            name: Bank.ALLY_BANK,
            photo:
              'https://firebasestorage.googleapis.com/v0/b/petromiles-f04cc.appspot.com/o/banks%2FAlly%20Bank.png?alt=media&token=a5063494-5235-4fcd-8bbb-cc0ead5ea862',
            country: { idCountry: 1, name: 'UNITED STATES' },
          };

          expectedRoutingNumberFound = undefined;

          (routingNumberRepository.findOne as jest.Mock).mockResolvedValue(
            expectedRoutingNumberFound,
          );

          expectedError = new BadRequestException();

          jest
            .spyOn(bankAccountService, 'getValidRoutingNumber')
            .mockRejectedValue(expectedError);
        });

        it('should throw when the routing number does not match with the bank', async () => {
          await expect(
            bankAccountService.getValidRoutingNumber(number, bank),
          ).rejects.toThrow(BadRequestException);
        });
      });
    });
  });

  describe('accountInfo(accountId)', () => {
    let expectedBankAccounts;
    let accountId;
    let result;
    describe('case: success', () => {
      describe('when everything works well', () => {
        beforeEach(async () => {
          accountId = 1;
          expectedBankAccounts = [
            {
              primary: false,
              nickname: 'test 1',
              accountNumber: '000123456789',
              type: 'Saving',
              firstName: 'petro',
              lastName: 'test',
              email: 'test@petromiles.com',
              state: 'verifying',
              initialDate: '2020-08-06T18:02:32.486Z',
              number: '082000073',
              idRoutingNumber: 2,
              bankName: Bank.BANK_OF_AMERICA,
              idBank: 1,
              photo:
                'https://firebasestorage.googleapis.com/v0/b/petromiles-f04cc.appspot.com/o/banks%2FBank%20of%20America.png?alt=media&token=84f6581d-cffe-47e7-a846-0b185460cc44',
            },
          ];

          execute.mockResolvedValue(expectedBankAccounts);

          result = await bankAccountService.accountInfo(accountId);
        });

        it('should invoke bankAccountRepository.createQueryBuilder()', () => {
          expect(execute).toHaveBeenCalledTimes(1);
          expect(
            bankAccountRepository.createQueryBuilder().where,
          ).toHaveBeenCalledWith('ba."idBankAccount" = :id', { id: accountId });
        });

        it('should return a bank account', () => {
          expect(result).toStrictEqual(expectedBankAccounts);
        });
      });
    });
  });

  describe('create(bankAccountCreateParams)', () => {
    let bankAccountCreateParams;
    let expectedRoutingNumberFound;
    let expectedUserDetails;
    let expectedBankAccount;
    let result;

    describe('case: success', () => {
      describe('when everything works well', () => {
        beforeEach(async () => {
          bankAccountCreateParams = {
            accountNumber: '000123456789',
            routingNumber: '124003116',
            checkNumber: '2267',
            type: 'Saving',
            nickname: 'test 1',
            userDetails: {
              firstName: 'Petro',
              lastName: 'Miles',
            },
            bank: {
              idBank: 2,
              name: Bank.ALLY_BANK,
              photo:
                'https://firebasestorage.googleapis.com/v0/b/petromiles-f04cc.appspot.com/o/banks%2FAlly%20Bank.png?alt=media&token=a5063494-5235-4fcd-8bbb-cc0ead5ea862',
              country: { idCountry: 1, name: 'UNITED STATES' },
            },
          };

          expectedRoutingNumberFound = {
            idRoutingNumber: 1,
            number: '124003116',
            bank: {
              idBank: 2,
              name: Bank.ALLY_BANK,
              photo:
                'https://firebasestorage.googleapis.com/v0/b/petromiles-f04cc.appspot.com/o/banks%2FAlly%20Bank.png?alt=media&token=a5063494-5235-4fcd-8bbb-cc0ead5ea862',
              country: { idCountry: 1, name: 'UNITED STATES' },
            },
          };

          expectedUserDetails = {
            firstName: 'Petro',
            lastName: 'Miles',
            email: 'test@petromiles.com',
            phone: '+12222311',
            middleName: null,
            secondLastName: null,
            birthdate: null,
            address: null,
            photo: null,
            customerId: null,
            accountId: null,
            idUserDetails: 1,
            userClient: null,
          };

          expectedBankAccount = {
            accountNumber: '000123456789',
            checkNumber: '2267',
            nickname: 'test 1',
            type: 'Saving',
            userDetails: {
              idUserDetails: 1,
              firstName: 'Petro',
              middleName: null,
              lastName: 'Miles',
              secondLastName: null,
              birthdate: null,
              address: null,
              phone: '+12222311',
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
                name: Bank.ALLY_BANK,
                photo:
                  'https://firebasestorage.googleapis.com/v0/b/petromiles-f04cc.appspot.com/o/banks%2FAlly%20Bank.png?alt=media&token=a5063494-5235-4fcd-8bbb-cc0ead5ea862',
                country: { idCountry: 1, name: 'UNITED STATES' },
              },
            },
            idBankAccount: 1,
          };

          jest
            .spyOn(bankAccountService, 'getValidRoutingNumber')
            .mockResolvedValue(expectedRoutingNumberFound);

          (userClientService.createDetails as jest.Mock).mockResolvedValue(
            expectedUserDetails,
          );

          (bankAccountRepository.save as jest.Mock).mockResolvedValue(
            expectedBankAccount,
          );

          result = await bankAccountService.create(bankAccountCreateParams);
        });

        it('should invoke bankAccountRepository.save()', () => {
          const {
            routingNumber,
            userDetails,
            ...bankAccount
          } = bankAccountCreateParams;
          expect(bankAccountRepository.save).toHaveBeenCalledTimes(1);
          expect(bankAccountRepository.save).toHaveBeenCalledWith({
            routingNumber: expectedRoutingNumberFound,
            userDetails: { ...expectedUserDetails },
            ...bankAccount,
          });
        });

        it('should return a bank account', () => {
          expect(result).toStrictEqual(expectedBankAccount);
        });
      });
    });
  });
});
