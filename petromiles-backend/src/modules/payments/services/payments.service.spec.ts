import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';

import { PaymentsService } from './payments.service';
import { PaymentProviderService } from '@/modules/payment-provider/payment-provider.service';
import { TransactionService } from '@/modules/transaction/services/transaction.service';
import { PointsConversionService } from '@/modules/management/services/points-conversion.service';
import { ThirdPartyInterestService } from '@/modules/management/services/third-party-interest.service';
import { PlatformInterestService } from '@/modules/management/services/platform-interest.service';
import { UserClientService } from '@/modules/user/services/user-client.service';
import { MailsService } from '@/modules/mails/mails.service';
import { SuscriptionService } from '@/modules/suscription/service/suscription.service';

import { Transaction } from '@/entities/transaction.entity';
import { ClientBankAccount } from '@/entities/client-bank-account.entity';
import { UserClient } from '@/entities/user-client.entity';
import { ClientPoints } from '@/entities/user-points.entity';

import { Interest } from '@/modules/payments/interest.interface';
import { PlatformInterest } from '@/enums/platform-interest.enum';
import { TransactionType } from '@/enums/transaction.enum';
import { PaymentProvider } from '@/enums/payment-provider.enum';
import { MailsSubjets } from '@/constants/mailsSubjectConst';

import { WinstonModule } from 'nest-winston';
import createOptions from '../../../logger/winston/winston-config';

describe('PaymentsService', () => {
  let paymentsService: PaymentsService;
  let RepositoryMock: jest.Mock;
  let clientBankAccountRepository: Repository<ClientBankAccount>;
  let userClientRepository: Repository<UserClient>;
  let transactionRepository: Repository<Transaction>;
  let PaymentProviderServiceMock: jest.Mock<Partial<PaymentProviderService>>;
  let paymentProviderService: PaymentProviderService;
  let TransactionServiceMock: jest.Mock<Partial<TransactionService>>;
  let transactionService: TransactionService;
  let PointsConversionServiceMock: jest.Mock<Partial<PointsConversionService>>;
  let pointsConversionService: PointsConversionService;
  let ThirdPartyInterestServiceMock: jest.Mock<Partial<
    ThirdPartyInterestService
  >>;
  let thirdPartyInterestService: ThirdPartyInterestService;
  let PlatformInterestServiceMock: jest.Mock<Partial<PlatformInterestService>>;
  let platformInterestService: PlatformInterestService;
  let UserClientServiceMock: jest.Mock<Partial<UserClientService>>;
  let userClientService: UserClientService;
  let MailsServiceMock: jest.Mock<Partial<MailsService>>;
  let mailsService: MailsService;
  let ConfigServiceMock: jest.Mock<Partial<ConfigService>>;
  let configService: ConfigService;
  let SuscriptionServiceMock: jest.Mock<Partial<SuscriptionService>>;
  let suscriptionService: SuscriptionService;

  beforeEach(() => {
    RepositoryMock = jest.fn(() => ({
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    }));
    PaymentProviderServiceMock = jest.fn<
      Partial<PaymentProviderService>,
      PaymentProviderService[]
    >(() => ({
      createCharge: jest.fn(),
      updateBankAccountOfAnAccount: jest.fn(),
      createTransfer: jest.fn(),
    }));
    TransactionServiceMock = jest.fn<
      Partial<TransactionService>,
      TransactionService[]
    >(() => ({
      createDeposit: jest.fn(),
      createWithdrawalTransaction: jest.fn(),
      getTransactions: jest.fn(),
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
      get: jest.fn(),
    }));
    PlatformInterestServiceMock = jest.fn<
      Partial<PlatformInterestService>,
      PlatformInterestService[]
    >(() => ({
      getInterestByName: jest.fn(),
    }));
    UserClientServiceMock = jest.fn<
      Partial<UserClientService>,
      UserClientService[]
    >(() => ({
      getPoints: jest.fn(),
    }));
    MailsServiceMock = jest.fn<Partial<MailsService>, MailsService[]>(() => ({
      sendEmail: jest.fn(),
    }));
    ConfigServiceMock = jest.fn<Partial<ConfigService>, ConfigService[]>(
      () => ({
        get: jest.fn(),
      }),
    );
    SuscriptionServiceMock = jest.fn<
      Partial<SuscriptionService>,
      SuscriptionService[]
    >(() => ({
      getSubscriptionPercentage: jest.fn(),
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
        PaymentsService,
        {
          provide: getRepositoryToken(ClientBankAccount),
          useClass: RepositoryMock,
        },
        {
          provide: getRepositoryToken(UserClient),
          useClass: RepositoryMock,
        },
        {
          provide: getRepositoryToken(Transaction),
          useClass: RepositoryMock,
        },
        {
          provide: PaymentProviderService,
          useClass: PaymentProviderServiceMock,
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
          provide: ThirdPartyInterestService,
          useClass: ThirdPartyInterestServiceMock,
        },
        {
          provide: PlatformInterestService,
          useClass: PlatformInterestServiceMock,
        },
        {
          provide: UserClientService,
          useClass: UserClientServiceMock,
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
          provide: SuscriptionService,
          useClass: SuscriptionServiceMock,
        },
      ],
    }).compile();

    paymentsService = module.get<PaymentsService>(PaymentsService);
    clientBankAccountRepository = module.get(
      getRepositoryToken(ClientBankAccount),
    );
    userClientRepository = module.get(getRepositoryToken(UserClient));
    transactionRepository = module.get(getRepositoryToken(Transaction));
    paymentProviderService = module.get<PaymentProviderService>(
      PaymentProviderService,
    );
    transactionService = module.get<TransactionService>(TransactionService);
    pointsConversionService = module.get<PointsConversionService>(
      PointsConversionService,
    );
    thirdPartyInterestService = module.get<ThirdPartyInterestService>(
      ThirdPartyInterestService,
    );
    platformInterestService = module.get<PlatformInterestService>(
      PlatformInterestService,
    );
    userClientService = module.get<UserClientService>(UserClientService);
    mailsService = module.get<MailsService>(MailsService);
    configService = module.get<ConfigService>(ConfigService);
    suscriptionService = module.get<SuscriptionService>(SuscriptionService);
  });

  describe('getOnePointToDollars()', () => {
    let expectedOnePointToDollars;
    let result;

    describe('case: success', () => {
      describe('when everything works well', () => {
        beforeEach(async () => {
          expectedOnePointToDollars = {
            idPointsConversion: 1,
            onePointEqualsDollars: 0.002,
            initialDate: new Date(),
            finalDate: null,
          };

          (pointsConversionService.getRecentPointsConversion as jest.Mock).mockResolvedValue(
            expectedOnePointToDollars,
          );

          result = await paymentsService.getOnePointToDollars();
        });

        it('should invoke pointsConversionService.getRecentPointsConversion()', () => {
          expect(
            pointsConversionService.getRecentPointsConversion,
          ).toHaveBeenCalledTimes(1);
        });

        it('should return a pointsConversion', () => {
          expect(result).toStrictEqual(expectedOnePointToDollars);
        });
      });
    });
  });

  describe('getInterests(trasactionType, platformInterestType)', () => {
    let expectedThirdPartyInterest;
    let expectedPlatformInterest;
    let expectedInterests: Interest[];
    let result: Interest[];

    describe('case: success', () => {
      describe('when everything works well', () => {
        beforeEach(async () => {
          expectedThirdPartyInterest = { amountDollarCents: 75, percentage: 0 };
          expectedPlatformInterest = { amount: 0, percentage: 0.1 };
          expectedInterests = [
            {
              operation: 1,
              amount: expectedThirdPartyInterest.amountDollarCents,
              percentage: expectedThirdPartyInterest.percentage,
            },
            { operation: 1, ...expectedPlatformInterest },
          ];

          (thirdPartyInterestService.get as jest.Mock).mockResolvedValue(
            expectedThirdPartyInterest,
          );
          (platformInterestService.getInterestByName as jest.Mock).mockResolvedValue(
            expectedPlatformInterest,
          );

          result = await paymentsService.getInterests(
            TransactionType.DEPOSIT,
            PlatformInterest.BUY,
          );
        });

        it('should invoke thirdPartyInterestService.get()', () => {
          expect(thirdPartyInterestService.get).toHaveBeenCalledTimes(1);
          expect(thirdPartyInterestService.get).toHaveBeenCalledWith(
            PaymentProvider.STRIPE,
            TransactionType.DEPOSIT,
          );
        });

        it('should invoke platformInterestService.getInterestByName()', () => {
          expect(
            platformInterestService.getInterestByName,
          ).toHaveBeenCalledTimes(1);
          expect(
            platformInterestService.getInterestByName,
          ).toHaveBeenCalledWith(PlatformInterest.BUY);
        });

        it('should return an array with the interests', () => {
          expect(result).toStrictEqual(expectedInterests);
        });
      });
    });
  });

  describe('buyPoints(idClientBankAccount, amount, amountToCharge, points, subscriptionName, infoSubscription)', () => {
    let idClientBankAccount: number;
    let amount: number;
    let amountToCharge: number;
    let points: string;
    let subscriptionName: string;
    let infoSubscription;
    let expectedThirdPartyInterest;
    let expectedPlatformInterest;
    let expectedInterests: Interest[];
    let expectedOnePointToDollars;
    let expectedClientBankAccount;
    let expectedCharge;
    let expectedTransaction: Partial<Transaction>;
    let result: Partial<Transaction>;

    describe('case: success', () => {
      describe('when everything works well', () => {
        beforeEach(async () => {
          idClientBankAccount = 1;
          amount = 20;
          amountToCharge = 97;
          points = '100';
          subscriptionName = 'gold';
          infoSubscription = {
            points: 2500,
            amountUpgrade: 200,
            percentage: 20,
          };

          expectedThirdPartyInterest = { amountDollarCents: 75, percentage: 0 };
          expectedPlatformInterest = { amount: 0, percentage: 0.1 };
          expectedInterests = [
            {
              operation: 1,
              amount: expectedThirdPartyInterest.amountDollarCents,
              percentage: expectedThirdPartyInterest.percentage,
            },
            { operation: 1, ...expectedPlatformInterest },
          ];
          expectedOnePointToDollars = {
            idPointsConversion: 1,
            onePointEqualsDollars: 0.002,
            initialDate: new Date(),
            finalDate: null,
          };
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
                    idSuscription: 3,
                    name: 'GOLD',
                    cost: 0,
                    upgradedAmount: 20000,
                    description: 'goldConditionals',
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
            stateBankAccount: [
              {
                idStateBankAccount: 1,
              },
            ],
          };

          expectedCharge = {
            id: 'prueba',
            amount: 20,
          };
          expectedTransaction = {
            totalAmountWithInterest: 77,
            rawAmount: 524,
            type: TransactionType.DEPOSIT,
            clientBankAccount: expectedClientBankAccount,
          };

          (thirdPartyInterestService.get as jest.Mock).mockResolvedValue(
            expectedThirdPartyInterest,
          );
          (platformInterestService.getInterestByName as jest.Mock).mockResolvedValue(
            expectedPlatformInterest,
          );
          jest
            .spyOn(paymentsService, 'getInterests')
            .mockResolvedValue(expectedInterests);

          (pointsConversionService.getRecentPointsConversion as jest.Mock).mockResolvedValue(
            expectedOnePointToDollars,
          );
          jest
            .spyOn(paymentsService, 'getOnePointToDollars')
            .mockResolvedValue(expectedOnePointToDollars);

          (suscriptionService.getSubscriptionPercentage as jest.Mock).mockResolvedValue(
            infoSubscription,
          );

          (clientBankAccountRepository.findOne as jest.Mock).mockResolvedValue(
            expectedClientBankAccount,
          );

          (paymentProviderService.createCharge as jest.Mock).mockResolvedValue(
            expectedCharge,
          );

          jest
            .spyOn(expectedClientBankAccount.userClient.userSuscription, 'find')
            .mockResolvedValue(
              expectedClientBankAccount.userClient.userSuscription[0],
            );

          (transactionService.createDeposit as jest.Mock).mockResolvedValue(
            expectedTransaction,
          );

          result = await paymentsService.buyPoints(
            idClientBankAccount,
            amount,
            amountToCharge,
            points,
            subscriptionName,
            infoSubscription,
          );
        });

        it('should invoke suscriptionService.getSubscriptionPercentage()', () => {
          expect(
            suscriptionService.getSubscriptionPercentage,
          ).toHaveBeenCalledTimes(1);
          expect(
            suscriptionService.getSubscriptionPercentage,
          ).toHaveBeenCalledWith(subscriptionName);
        });

        it('should invoke clientBankAccountRepository.findOne()', () => {
          expect(clientBankAccountRepository.findOne).toHaveBeenCalledTimes(1);
          expect(clientBankAccountRepository.findOne).toHaveBeenCalledWith({
            idClientBankAccount,
          });
        });

        it('should invoke paymentProviderService.createCharge()', () => {
          expect(paymentProviderService.createCharge).toHaveBeenCalledTimes(1);
          expect(paymentProviderService.createCharge).toHaveBeenCalledWith({
            customer:
              expectedClientBankAccount.userClient.userDetails[0].customerId,
            source: expectedClientBankAccount.chargeId,
            currency: 'usd',
            amount: Math.round(amountToCharge),
          });
        });

        it('should invoke transactionService.createDeposit()', () => {
          expect(transactionService.createDeposit).toHaveBeenCalledTimes(1);
          expect(transactionService.createDeposit).toHaveBeenCalledWith(
            expectedClientBankAccount,
            subscriptionName,
            amount,
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
      describe('when the user has no updated configuration parameters', () => {
        beforeEach(async () => {
          idClientBankAccount = 1;
          amount = 20;
          amountToCharge = 90;
          points = '100';
          subscriptionName = 'gold';
          infoSubscription = {
            points: 2500,
            amountUpgrade: 200,
            percentage: 20,
          };

          expectedThirdPartyInterest = { amountDollarCents: 75, percentage: 0 };
          expectedPlatformInterest = { amount: 0, percentage: 0.1 };
          expectedInterests = [
            {
              operation: 1,
              amount: expectedThirdPartyInterest.amountDollarCents,
              percentage: expectedThirdPartyInterest.percentage,
            },
            { operation: 1, ...expectedPlatformInterest },
          ];
          expectedOnePointToDollars = {
            idPointsConversion: 1,
            onePointEqualsDollars: 0.002,
            initialDate: new Date(),
            finalDate: null,
          };

          (thirdPartyInterestService.get as jest.Mock).mockResolvedValue(
            expectedThirdPartyInterest,
          );
          (platformInterestService.getInterestByName as jest.Mock).mockResolvedValue(
            expectedPlatformInterest,
          );
          jest
            .spyOn(paymentsService, 'getInterests')
            .mockResolvedValue(expectedInterests);

          (pointsConversionService.getRecentPointsConversion as jest.Mock).mockResolvedValue(
            expectedOnePointToDollars,
          );
          jest
            .spyOn(paymentsService, 'getOnePointToDollars')
            .mockResolvedValue(expectedOnePointToDollars);

          (suscriptionService.getSubscriptionPercentage as jest.Mock).mockResolvedValue(
            infoSubscription,
          );

          expectedError = new BadRequestException();

          jest
            .spyOn(paymentsService, 'buyPoints')
            .mockRejectedValue(expectedError);
        });

        it('should throw when the the user has no updated configuration parameters', async () => {
          await expect(
            paymentsService.buyPoints(
              idClientBankAccount,
              amount,
              amountToCharge,
              points,
              subscriptionName,
              infoSubscription,
            ),
          ).rejects.toThrow(BadRequestException);
        });

        it('should not invoke clientBankAccountRepository.findOne()', () => {
          expect(clientBankAccountRepository.findOne).not.toHaveBeenCalled();
        });

        it('should invoke paymentProviderService.createCharge()', () => {
          expect(paymentProviderService.createCharge).not.toHaveBeenCalled();
        });

        it('should invoke transactionService.createDeposit()', () => {
          expect(transactionService.createDeposit).not.toHaveBeenCalled();
        });
      });

      describe('when the user has no updated configuration parameters of the subscription', () => {
        beforeEach(async () => {
          idClientBankAccount = 1;
          amount = 20;
          amountToCharge = 97;
          points = '100';
          subscriptionName = 'gold';
          infoSubscription = {
            points: 100,
            amountUpgrade: 200,
            percentage: 20,
          };

          expectedThirdPartyInterest = { amountDollarCents: 75, percentage: 0 };
          expectedPlatformInterest = { amount: 0, percentage: 0.1 };
          expectedInterests = [
            {
              operation: 1,
              amount: expectedThirdPartyInterest.amountDollarCents,
              percentage: expectedThirdPartyInterest.percentage,
            },
            { operation: 1, ...expectedPlatformInterest },
          ];
          expectedOnePointToDollars = {
            idPointsConversion: 1,
            onePointEqualsDollars: 0.002,
            initialDate: new Date(),
            finalDate: null,
          };

          (thirdPartyInterestService.get as jest.Mock).mockResolvedValue(
            expectedThirdPartyInterest,
          );
          (platformInterestService.getInterestByName as jest.Mock).mockResolvedValue(
            expectedPlatformInterest,
          );
          jest
            .spyOn(paymentsService, 'getInterests')
            .mockResolvedValue(expectedInterests);

          (pointsConversionService.getRecentPointsConversion as jest.Mock).mockResolvedValue(
            expectedOnePointToDollars,
          );
          jest
            .spyOn(paymentsService, 'getOnePointToDollars')
            .mockResolvedValue(expectedOnePointToDollars);

          (suscriptionService.getSubscriptionPercentage as jest.Mock).mockResolvedValue(
            infoSubscription,
          );

          expectedError = new BadRequestException();

          jest
            .spyOn(paymentsService, 'buyPoints')
            .mockRejectedValue(expectedError);
        });

        it('should throw when the the user has no updated configuration parameters of the subscription', async () => {
          await expect(
            paymentsService.buyPoints(
              idClientBankAccount,
              amount,
              amountToCharge,
              points,
              subscriptionName,
              infoSubscription,
            ),
          ).rejects.toThrow(BadRequestException);
        });

        it('should not invoke clientBankAccountRepository.findOne()', () => {
          expect(clientBankAccountRepository.findOne).not.toHaveBeenCalled();
        });

        it('should invoke paymentProviderService.createCharge()', () => {
          expect(paymentProviderService.createCharge).not.toHaveBeenCalled();
        });

        it('should invoke transactionService.createDeposit()', () => {
          expect(transactionService.createDeposit).not.toHaveBeenCalled();
        });
      });
    });
  });

  describe('withdrawPoints(user, idClientBankAccount, amount, amountToCharge, points)', () => {
    let user;
    let idClientBankAccount: number;
    let amount: number;
    let amountToCharge: number;
    let points: number;
    let expectedThirdPartyInterest;
    let expectedPlatformInterest;
    let expectedInterests: Interest[];
    let expectedOnePointToDollars;
    let expectedClientPoints: Partial<ClientPoints>;
    let expectedClientBankAccount;
    let expectedTransfer;
    let expectedTransaction: Partial<Transaction>;
    let result: Partial<Transaction>;

    describe('case: success', () => {
      describe('when everything works well', () => {
        beforeEach(async () => {
          user = { email: 'prueba@gmail.com', id: 1, role: 'CLIENT' };
          idClientBankAccount = 1;
          amount = 100;
          amountToCharge = 20;
          points = 500;

          expectedThirdPartyInterest = { amountDollarCents: 75, percentage: 0 };
          expectedPlatformInterest = { amount: 0, percentage: 0.05 };
          expectedInterests = [
            {
              operation: 1,
              amount: expectedThirdPartyInterest.amountDollarCents,
              percentage: expectedThirdPartyInterest.percentage,
            },
            { operation: 1, ...expectedPlatformInterest },
          ];
          expectedOnePointToDollars = {
            idPointsConversion: 1,
            onePointEqualsDollars: 0.002,
            initialDate: new Date(),
            finalDate: null,
          };
          expectedClientPoints = {
            dollars: 1000000000,
          };
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
            stateBankAccount: [
              {
                idStateBankAccount: 1,
              },
            ],
          };
          expectedTransfer = {
            id: 'prueba',
            amount: 20,
          };
          expectedTransaction = {
            totalAmountWithInterest: 80,
            rawAmount: 100,
            type: TransactionType.WITHDRAWAL,
            clientBankAccount: expectedClientBankAccount,
          };

          (thirdPartyInterestService.get as jest.Mock).mockResolvedValue(
            expectedThirdPartyInterest,
          );
          (platformInterestService.getInterestByName as jest.Mock).mockResolvedValue(
            expectedPlatformInterest,
          );
          jest
            .spyOn(paymentsService, 'getInterests')
            .mockResolvedValue(expectedInterests);

          (pointsConversionService.getRecentPointsConversion as jest.Mock).mockResolvedValue(
            expectedOnePointToDollars,
          );
          jest
            .spyOn(paymentsService, 'getOnePointToDollars')
            .mockResolvedValue(expectedOnePointToDollars);

          (clientBankAccountRepository.findOne as jest.Mock).mockResolvedValue(
            expectedClientBankAccount,
          );

          (userClientService.getPoints as jest.Mock).mockResolvedValue(
            expectedClientPoints,
          );

          (paymentProviderService.createTransfer as jest.Mock).mockResolvedValue(
            expectedTransfer,
          );
          (transactionService.createWithdrawalTransaction as jest.Mock).mockResolvedValue(
            expectedTransaction,
          );

          result = await paymentsService.withdrawPoints(
            user,
            idClientBankAccount,
            amount,
            amountToCharge,
            points,
          );
        });

        it('should invoke clientBankAccountRepository.findOne()', () => {
          expect(clientBankAccountRepository.findOne).toHaveBeenCalledTimes(1);
          expect(clientBankAccountRepository.findOne).toHaveBeenCalledWith({
            idClientBankAccount,
          });
        });

        it('should invoke userClientService.getPoints()', () => {
          expect(userClientService.getPoints).toHaveBeenCalledTimes(1);
          expect(userClientService.getPoints).toHaveBeenCalledWith(user.id);
        });

        it('should invoke paymentProviderService.updateBankAccountOfAnAccount()', () => {
          expect(
            paymentProviderService.updateBankAccountOfAnAccount,
          ).toHaveBeenCalledTimes(1);
          expect(
            paymentProviderService.updateBankAccountOfAnAccount,
          ).toHaveBeenCalledWith(
            expectedClientBankAccount.userClient.userDetails[0].accountId,
            expectedClientBankAccount.transferId,
            {
              default_for_currency: true,
            },
          );
        });

        it('should invoke paymentProviderService.createTransfer()', () => {
          expect(paymentProviderService.createTransfer).toHaveBeenCalledTimes(
            1,
          );
          expect(paymentProviderService.createTransfer).toHaveBeenCalledWith({
            destination:
              expectedClientBankAccount.userClient.userDetails[0].accountId,
            currency: 'usd',
            amount: Math.round(amountToCharge),
            source_type: 'bank_account',
          });
        });

        it('should invoke transactionService.createWithdrawalTransaction()', () => {
          expect(
            transactionService.createWithdrawalTransaction,
          ).toHaveBeenCalledTimes(1);
          expect(
            transactionService.createWithdrawalTransaction,
          ).toHaveBeenCalledWith(
            expectedClientBankAccount,
            amount,
            expectedTransfer.id,
          );
        });

        it('should return a transaction', () => {
          expect(result).toStrictEqual(expectedTransaction);
        });
      });
    });

    describe('case: failure', () => {
      let expectedError: BadRequestException;
      describe('when the user has no updated configuration parameters', () => {
        beforeEach(async () => {
          user = { email: 'prueba@gmail.com', id: 1, role: 'CLIENT' };
          idClientBankAccount = 1;
          amount = 100;
          amountToCharge = 20;
          points = 200;

          expectedThirdPartyInterest = { amountDollarCents: 75, percentage: 0 };
          expectedPlatformInterest = { amount: 0, percentage: 0.05 };
          expectedInterests = [
            {
              operation: 1,
              amount: expectedThirdPartyInterest.amountDollarCents,
              percentage: expectedThirdPartyInterest.percentage,
            },
            { operation: 1, ...expectedPlatformInterest },
          ];
          expectedOnePointToDollars = {
            idPointsConversion: 1,
            onePointEqualsDollars: 0.002,
            initialDate: new Date(),
            finalDate: null,
          };

          (thirdPartyInterestService.get as jest.Mock).mockResolvedValue(
            expectedThirdPartyInterest,
          );
          (platformInterestService.getInterestByName as jest.Mock).mockResolvedValue(
            expectedPlatformInterest,
          );
          jest
            .spyOn(paymentsService, 'getInterests')
            .mockResolvedValue(expectedInterests);

          (pointsConversionService.getRecentPointsConversion as jest.Mock).mockResolvedValue(
            expectedOnePointToDollars,
          );
          jest
            .spyOn(paymentsService, 'getOnePointToDollars')
            .mockResolvedValue(expectedOnePointToDollars);

          expectedError = new BadRequestException();

          jest
            .spyOn(paymentsService, 'withdrawPoints')
            .mockRejectedValue(expectedError);
        });

        it('should throw when the the user has no updated configuration parameters', async () => {
          await expect(
            paymentsService.withdrawPoints(
              user,
              idClientBankAccount,
              amount,
              amountToCharge,
              points,
            ),
          ).rejects.toThrow(BadRequestException);
        });

        it('should not invoke clientBankAccountRepository.findOne()', () => {
          expect(clientBankAccountRepository.findOne).not.toHaveBeenCalled();
        });

        it('should not invoke userClientService.getPoints()', () => {
          expect(userClientService.getPoints).not.toHaveBeenCalled();
        });

        it('should not invoke paymentProviderService.updateBankAccountOfAnAccount()', () => {
          expect(
            paymentProviderService.updateBankAccountOfAnAccount,
          ).not.toHaveBeenCalled();
        });

        it('should not invoke paymentProviderService.createTransfer()', () => {
          expect(paymentProviderService.createTransfer).not.toHaveBeenCalled();
        });

        it('should not invoke transactionService.createWithdrawalTransaction()', () => {
          expect(
            transactionService.createWithdrawalTransaction,
          ).not.toHaveBeenCalled();
        });
      });

      describe('when the user does not have enough points', () => {
        beforeEach(async () => {
          user = { email: 'prueba@gmail.com', id: 1, role: 'CLIENT' };
          idClientBankAccount = 1;
          amount = 100;
          amountToCharge = 20;
          points = 500;

          expectedThirdPartyInterest = { amountDollarCents: 75, percentage: 0 };
          expectedPlatformInterest = { amount: 0, percentage: 0.05 };
          expectedInterests = [
            {
              operation: 1,
              amount: expectedThirdPartyInterest.amountDollarCents,
              ...expectedThirdPartyInterest,
            },
            { operation: 1, ...expectedPlatformInterest },
          ];
          expectedOnePointToDollars = {
            idPointsConversion: 1,
            onePointEqualsDollars: 0.002,
            initialDate: new Date(),
            finalDate: null,
          };
          expectedClientPoints = {
            dollars: 50,
            points: 250,
            email: 'prueba@gmail.com',
          };
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
            stateBankAccount: [
              {
                idStateBankAccount: 1,
              },
            ],
          };

          (thirdPartyInterestService.get as jest.Mock).mockResolvedValue(
            expectedThirdPartyInterest,
          );
          (platformInterestService.getInterestByName as jest.Mock).mockResolvedValue(
            expectedPlatformInterest,
          );
          jest
            .spyOn(paymentsService, 'getInterests')
            .mockResolvedValue(expectedInterests);

          (pointsConversionService.getRecentPointsConversion as jest.Mock).mockResolvedValue(
            expectedOnePointToDollars,
          );
          jest
            .spyOn(paymentsService, 'getOnePointToDollars')
            .mockResolvedValue(expectedOnePointToDollars);

          (clientBankAccountRepository.findOne as jest.Mock).mockResolvedValue(
            expectedClientBankAccount,
          );

          (userClientService.getPoints as jest.Mock).mockResolvedValue(
            expectedClientPoints,
          );

          expectedError = new BadRequestException();

          jest
            .spyOn(paymentsService, 'withdrawPoints')
            .mockRejectedValue(expectedError);
        });

        it('should throw when the user does not have enough points', async () => {
          await expect(
            paymentsService.withdrawPoints(
              user,
              idClientBankAccount,
              amount,
              amountToCharge,
              points,
            ),
          ).rejects.toThrow(BadRequestException);
        });

        it('should not invoke paymentProviderService.updateBankAccountOfAnAccount()', () => {
          expect(
            paymentProviderService.updateBankAccountOfAnAccount,
          ).not.toHaveBeenCalled();
        });

        it('should not invoke paymentProviderService.createTransfer()', () => {
          expect(paymentProviderService.createTransfer).not.toHaveBeenCalled();
        });

        it('should not invoke transactionService.createWithdrawalTransaction()', () => {
          expect(
            transactionService.createWithdrawalTransaction,
          ).not.toHaveBeenCalled();
        });
      });
    });
  });

  describe('sendPaymentInvoiceEmail(user, file)', () => {
    let user;
    let file;
    let expectedUserClient;
    let expectedTransactionCode;
    let expectedTransaction;
    let languageMails;
    let template;
    let subject;
    let mailParameters;

    describe('case: success', () => {
      describe('when everything works well', () => {
        beforeEach(async () => {
          user = {
            email: 'prueba@gmail.com',
            id: 1,
            role: 'CLIENT',
          };
          file = {
            fieldname: 'file',
            originalname: '2020 2:59',
            encoding: '7bit',
            mimetype: 'application/pdf',
            buffer: new Buffer('prueba'),
            size: 150239,
          };
          expectedUserClient = {
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
              },
            ],
          };
          expectedTransactionCode = [
            {
              id: 1,
              paymentProviderTransactionId: 'prueba',
            },
          ];
          expectedTransaction = {
            idTransaction: 1,
            paymentProviderTransactionId: 'prueba',
          };

          languageMails = expectedUserClient.userDetails[0].language.name;
          template = `invoice[${languageMails}]`;
          subject = MailsSubjets.invoice[languageMails];
          mailParameters = {
            to: expectedUserClient.email,
            subject: subject,
            templateId: 'prueba',
            dynamic_template_data: {
              user: expectedUserClient.userDetails[0].firstName,
            },
            attachments: [
              {
                filename: `PetroMiles[invoice]-${new Date().toLocaleDateString()}-${
                  expectedTransaction.paymentProviderTransactionId
                }`,
                type: file.mimetype,
                content: file.buffer.toString('base64'),
              },
            ],
          };

          (userClientRepository.findOne as jest.Mock).mockResolvedValue(
            expectedUserClient,
          );

          jest
            .spyOn(expectedUserClient.userDetails, 'find')
            .mockResolvedValue(expectedUserClient.userDetails[0]);

          (transactionService.getTransactions as jest.Mock).mockResolvedValue(
            expectedTransactionCode,
          );

          (transactionRepository.findOne as jest.Mock).mockResolvedValue(
            expectedTransaction,
          );

          (configService.get as jest.Mock).mockReturnValue('prueba');

          (mailsService.sendEmail as jest.Mock).mockImplementation();

          await paymentsService.sendPaymentInvoiceEmail(user, file);
        });

        it('should invoke userClientRepository.findOne()', () => {
          expect(userClientRepository.findOne).toHaveBeenCalledTimes(1);
          expect(userClientRepository.findOne).toHaveBeenCalledWith({
            email: user.email,
          });
        });

        it('should invoke transactionService.getTransactions()', () => {
          expect(transactionService.getTransactions).toHaveBeenCalledTimes(1);
          expect(transactionService.getTransactions).toHaveBeenCalledWith(
            expectedUserClient.idUserClient,
          );
        });

        it('should invoke transactionRepository.findOne()', () => {
          expect(transactionRepository.findOne).toHaveBeenCalledTimes(1);
          expect(transactionRepository.findOne).toHaveBeenCalledWith({
            idTransaction: expectedTransactionCode[0].id,
          });
        });

        it('should invoke configService.get()', () => {
          expect(configService.get).toHaveBeenCalledTimes(1);
          expect(configService.get).toHaveBeenCalledWith(
            `mails.sendgrid.templates.${template}`,
          );
        });

        it('should invoke mailsService.sendEmail()', () => {
          expect(mailsService.sendEmail).toHaveBeenCalledTimes(1);
          expect(mailsService.sendEmail).toHaveBeenCalledWith(mailParameters);
        });
      });
    });
  });

  describe('sendWithdrawalInvoiceEmail(user, file, points, total)', () => {
    let user;
    let file;
    let points;
    let total;
    let expectedUserClient;
    let expectedTransactionCode;
    let expectedTransaction;
    let languageMails;
    let template;
    let subject;
    let mailParameters;

    describe('case: success', () => {
      describe('when everything works well', () => {
        beforeEach(async () => {
          user = {
            email: 'prueba@gmail.com',
            id: 1,
            role: 'CLIENT',
          };
          file = {
            fieldname: 'file',
            originalname: '2020 2:59',
            encoding: '7bit',
            mimetype: 'application/pdf',
            buffer: new Buffer('prueba'),
            size: 150239,
          };
          points = 1000;
          total = 1.15;
          expectedUserClient = {
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
              },
            ],
          };
          expectedTransactionCode = [
            {
              id: 1,
              paymentProviderTransactionId: 'prueba',
            },
          ];
          expectedTransaction = {
            idTransaction: 1,
            paymentProviderTransactionId: 'prueba',
          };

          languageMails = expectedUserClient.userDetails[0].language.name;
          template = `withdrawal[${languageMails}]`;
          subject = MailsSubjets.invoice[languageMails];
          mailParameters = {
            to: expectedUserClient.email,
            subject: subject,
            templateId: 'prueba',
            dynamic_template_data: {
              user: expectedUserClient.userDetails[0].firstName,
              numberPoints: points,
              dollarWithdrawal: total,
            },
            attachments: [
              {
                filename: `PetroMiles[invoice]-${new Date().toLocaleDateString()}-${
                  expectedTransaction.paymentProviderTransactionId
                }`,
                type: file.mimetype,
                content: file.buffer.toString('base64'),
              },
            ],
          };

          (userClientRepository.findOne as jest.Mock).mockResolvedValue(
            expectedUserClient,
          );

          jest
            .spyOn(expectedUserClient.userDetails, 'find')
            .mockResolvedValue(expectedUserClient.userDetails[0]);

          (transactionService.getTransactions as jest.Mock).mockResolvedValue(
            expectedTransactionCode,
          );

          (transactionRepository.findOne as jest.Mock).mockResolvedValue(
            expectedTransaction,
          );

          (configService.get as jest.Mock).mockReturnValue('prueba');

          (mailsService.sendEmail as jest.Mock).mockImplementation();

          await paymentsService.sendWithdrawalInvoiceEmail(
            user,
            file,
            points,
            total,
          );
        });

        it('should invoke userClientRepository.findOne()', () => {
          expect(userClientRepository.findOne).toHaveBeenCalledTimes(1);
          expect(userClientRepository.findOne).toHaveBeenCalledWith({
            email: user.email,
          });
        });

        it('should invoke transactionService.getTransactions()', () => {
          expect(transactionService.getTransactions).toHaveBeenCalledTimes(1);
          expect(transactionService.getTransactions).toHaveBeenCalledWith(
            expectedUserClient.idUserClient,
          );
        });

        it('should invoke transactionRepository.findOne()', () => {
          expect(transactionRepository.findOne).toHaveBeenCalledTimes(1);
          expect(transactionRepository.findOne).toHaveBeenCalledWith({
            idTransaction: expectedTransactionCode[0].id,
          });
        });

        it('should invoke configService.get()', () => {
          expect(configService.get).toHaveBeenCalledTimes(1);
          expect(configService.get).toHaveBeenCalledWith(
            `mails.sendgrid.templates.${template}`,
          );
        });

        it('should invoke mailsService.sendEmail()', () => {
          expect(mailsService.sendEmail).toHaveBeenCalledTimes(1);
          expect(mailsService.sendEmail).toHaveBeenCalledWith(mailParameters);
        });
      });
    });
  });
});
