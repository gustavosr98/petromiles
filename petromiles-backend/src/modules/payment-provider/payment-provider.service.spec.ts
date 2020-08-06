import { Test, TestingModule } from '@nestjs/testing';

import { PaymentProviderService } from './payment-provider.service';
import { StripeService } from '@/modules/payment-provider/stripe/stripe.service';

import { WinstonModule } from 'nest-winston';
import createOptions from '../../logger/winston/winston-config';

describe('PaymentProviderService', () => {
  let paymentProviderService: PaymentProviderService;
  let StripeServiceMock: jest.Mock<Partial<StripeService>>;
  let stripeService: StripeService;

  beforeEach(() => {
    StripeServiceMock = jest.fn<Partial<StripeService>, StripeService[]>(
      () => ({
        createBankAccountByToken: jest.fn(),
        asociateBankAccountToAccount: jest.fn(),
        verifyBankAccount: jest.fn(),
        createCharge: jest.fn(),
        createPayout: jest.fn(),
        createAccount: jest.fn(),
        updateBankAccountOfAnAccount: jest.fn(),
        deleteBankAccount: jest.fn(),
        createTransfer: jest.fn(),
        asociateBankToCustomer: jest.fn(),
        findAllCustomers: jest.fn(),
        findCustomer: jest.fn(),
        createCustomer: jest.fn(),
        updateCustomer: jest.fn(),
        deleteCustomer: jest.fn(),
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
        PaymentProviderService,
        {
          provide: StripeService,
          useClass: StripeServiceMock,
        },
      ],
    }).compile();

    paymentProviderService = module.get<PaymentProviderService>(
      PaymentProviderService,
    );
    stripeService = module.get<StripeService>(StripeService);
  });

  describe('createBankAccount(userClient, bankAccountCreateParams)', () => {
    let result;
    let expectedResult;
    let userClient;
    let bankAccountCreateParams;
    let expectedBankAccountToken;
    let expectedBankAccountSource;
    let expectedAsociatedBankAccount;
    let bankAccount;

    describe('case: success', () => {
      describe('when everything works well', () => {
        beforeEach(async () => {
          userClient = {
            email: 'prueba@gmail.com',
            userDetails: {
              customerId: 'prueba',
              accountId: 'prueba',
            },
          };
          bankAccountCreateParams = {
            userDetails: {
              firstName: 'Pedro',
              lastName: 'Perez',
            },
            routingNumber: 'prueba',
            accountNumber: 'prueba',
          };
          bankAccount = {
            country: 'US',
            currency: 'usd',
            account_holder_name: `${bankAccountCreateParams.userDetails.firstName} ${bankAccountCreateParams.userDetails.lastName}`,
            account_holder_type: 'individual',
            routing_number: bankAccountCreateParams.routingNumber,
            account_number: bankAccountCreateParams.accountNumber,
          };

          expectedBankAccountToken = {
            id: 'prueba',
          };
          expectedBankAccountSource = {
            id: 'prueba',
          };
          expectedAsociatedBankAccount = {
            id: 'prueba',
          };
          expectedResult = {
            transferId: expectedAsociatedBankAccount.id,
            chargeId: expectedBankAccountSource.id,
          };

          (stripeService.createBankAccountByToken as jest.Mock).mockResolvedValue(
            expectedBankAccountToken,
          );
          (stripeService.asociateBankToCustomer as jest.Mock).mockResolvedValue(
            expectedBankAccountSource,
          );
          (stripeService.asociateBankAccountToAccount as jest.Mock).mockResolvedValue(
            expectedAsociatedBankAccount,
          );

          result = await paymentProviderService.createBankAccount(
            userClient,
            bankAccountCreateParams,
          );
        });

        it('should invoke stripeService.createBankAccountByToken()', () => {
          expect(stripeService.createBankAccountByToken).toHaveBeenCalledTimes(
            2,
          );
          expect(stripeService.createBankAccountByToken).toHaveBeenCalledWith({
            bank_account: bankAccount,
          });
        });

        it('should invoke stripeService.asociateBankToCustomer()', () => {
          expect(stripeService.asociateBankToCustomer).toHaveBeenCalledTimes(1);
          expect(stripeService.asociateBankToCustomer).toHaveBeenCalledWith(
            userClient.userDetails.customerId,
            expectedBankAccountToken.id,
          );
        });

        it('should invoke stripeService.asociateBankAccountToAccount()', () => {
          expect(
            stripeService.asociateBankAccountToAccount,
          ).toHaveBeenCalledTimes(1);
          expect(
            stripeService.asociateBankAccountToAccount,
          ).toHaveBeenCalledWith(
            userClient.userDetails.accountId,
            expectedBankAccountToken.id,
          );
        });

        it('should return the info of the Stripe', () => {
          expect(result).toStrictEqual(expectedResult);
        });
      });
    });
  });

  describe('verifyBankAccount(verificationRequest)', () => {
    let result;
    let expectedResult;
    let verificationRequest;

    describe('case: success', () => {
      describe('when everything works well', () => {
        beforeEach(async () => {
          verificationRequest = {
            customerId: 'prueba',
            bankAccountId: 'prueba',
            amounts: [125, 125],
          };

          expectedResult = {
            id: 'prueba',
            status: 'verified',
          };

          (stripeService.verifyBankAccount as jest.Mock).mockResolvedValue(
            expectedResult,
          );

          result = await paymentProviderService.verifyBankAccount(
            verificationRequest,
          );
        });

        it('should invoke stripeService.verifyBankAccount()', () => {
          expect(stripeService.verifyBankAccount).toHaveBeenCalledTimes(1);
          expect(stripeService.verifyBankAccount).toHaveBeenCalledWith(
            verificationRequest,
          );
        });

        it('should return a verified bank account', () => {
          expect(result).toStrictEqual(expectedResult);
        });
      });
    });
  });

  describe('createCharge(chargeCreateParams)', () => {
    let result;
    let expectedResult;
    let chargeCreateParams;

    describe('case: success', () => {
      describe('when everything works well', () => {
        beforeEach(async () => {
          chargeCreateParams = {
            customer: 'prueba',
            source: 'prueba',
            currency: 'usd',
            amount: 100,
          };

          expectedResult = {
            id: 'prueba',
            object: 'charge',
            amount: 100,
            source: 'prueba',
            customer: 'prueba',
            currency: 'usd',
          };

          (stripeService.createCharge as jest.Mock).mockResolvedValue(
            expectedResult,
          );

          result = await paymentProviderService.createCharge(
            chargeCreateParams,
          );
        });

        it('should invoke stripeService.createCharge()', () => {
          expect(stripeService.createCharge).toHaveBeenCalledTimes(1);
          expect(stripeService.createCharge).toHaveBeenCalledWith(
            chargeCreateParams,
          );
        });

        it('should return a charge', () => {
          expect(result).toStrictEqual(expectedResult);
        });
      });
    });
  });

  describe('createPayout(payoutCreateParams)', () => {
    let result;
    let expectedResult;
    let payoutCreateParams;

    describe('case: success', () => {
      describe('when everything works well', () => {
        beforeEach(async () => {
          payoutCreateParams = {
            currency: 'usd',
            amount: 100,
          };

          expectedResult = {
            id: 'prueba',
            object: 'payout',
            amount: 100,
            currency: 'usd',
          };

          (stripeService.createPayout as jest.Mock).mockResolvedValue(
            expectedResult,
          );

          result = await paymentProviderService.createPayout(
            payoutCreateParams,
          );
        });

        it('should invoke stripeService.createPayout()', () => {
          expect(stripeService.createPayout).toHaveBeenCalledTimes(1);
          expect(stripeService.createPayout).toHaveBeenCalledWith(
            payoutCreateParams,
          );
        });

        it('should return a payout', () => {
          expect(result).toStrictEqual(expectedResult);
        });
      });
    });
  });

  describe('createAccount(user)', () => {
    let result;
    let expectedResult;
    let user;
    let params;

    describe('case: success', () => {
      describe('when everything works well', () => {
        beforeEach(async () => {
          user = {
            email: 'prueba@gmail.com',
            name: 'Pedro',
            lastName: 'Perez',
            customerId: 'prueba',
            ip: '192.168.1.2',
          };
          params = {
            type: 'custom',
            country: 'US',
            email: user.email,
            requested_capabilities: ['transfers'],
            business_type: 'individual',
            individual: {
              first_name: user.name,
              last_name: user.lastName,
              email: user.email,
            },
            business_profile: {
              url: user.name.toLowerCase().replace(' ', '') + '.com',
            },
            tos_acceptance: {
              ip: user.ip,
              date: Math.round(new Date().getTime() / 1000),
            },
            metadata: {
              customerId: user.customerId,
            },
          };

          expectedResult = {
            id: 'prueba',
            object: 'account',
            country: 'US',
            email: user.email,
            type: 'custom',
            business_type: 'individual',
            individual: {
              first_name: user.name,
              last_name: user.lastName,
              email: user.email,
            },
            business_profile: {
              url: user.name.toLowerCase().replace(' ', '') + '.com',
            },
            tos_acceptance: {
              ip: user.ip,
              date: Math.round(new Date().getTime() / 1000),
            },
            metadata: {
              customerId: user.customerId,
            },
          };

          (stripeService.createAccount as jest.Mock).mockResolvedValue(
            expectedResult,
          );

          result = await paymentProviderService.createAccount(user);
        });

        it('should invoke stripeService.createAccount()', () => {
          expect(stripeService.createAccount).toHaveBeenCalledTimes(1);
          expect(stripeService.createAccount).toHaveBeenCalledWith(params);
        });

        it('should return an account', () => {
          expect(result).toStrictEqual(expectedResult);
        });
      });
    });
  });

  describe('updateBankAccountOfAnAccount(accountId, bankAccountId, accountUpdateParams)', () => {
    let result;
    let expectedResult;
    let accountId;
    let bankAccountId;
    let accountUpdateParams;

    describe('case: success', () => {
      describe('when everything works well', () => {
        beforeEach(async () => {
          accountId = 'prueba';
          bankAccountId = 'prueba';
          accountUpdateParams = { default_for_currency: true };

          expectedResult = {
            id: bankAccountId,
            object: 'bank_account',
            account: accountId,
            default_for_currency: true,
          };

          (stripeService.updateBankAccountOfAnAccount as jest.Mock).mockResolvedValue(
            expectedResult,
          );

          result = await paymentProviderService.updateBankAccountOfAnAccount(
            accountId,
            bankAccountId,
            accountUpdateParams,
          );
        });

        it('should invoke stripeService.updateBankAccountOfAnAccount()', () => {
          expect(
            stripeService.updateBankAccountOfAnAccount,
          ).toHaveBeenCalledTimes(1);
          expect(
            stripeService.updateBankAccountOfAnAccount,
          ).toHaveBeenCalledWith(accountId, bankAccountId, accountUpdateParams);
        });

        it('should return an updated account', () => {
          expect(result).toStrictEqual(expectedResult);
        });
      });
    });
  });

  describe('deleteBankAccount(customerId, bankAccountId, email)', () => {
    let expectedResult;
    let customerId;
    let bankAccountId;
    let email;

    describe('case: success', () => {
      describe('when everything works well', () => {
        beforeEach(async () => {
          customerId = 'prueba';
          bankAccountId = 'prueba';
          email = 'prueba@gmail.com';

          expectedResult = {
            id: bankAccountId,
            object: 'bank_account',
            deleted: true,
          };

          (stripeService.deleteBankAccount as jest.Mock).mockResolvedValue(
            expectedResult,
          );

          await paymentProviderService.deleteBankAccount(
            customerId,
            bankAccountId,
            email,
          );
        });

        it('should invoke stripeService.deleteBankAccount()', () => {
          expect(stripeService.deleteBankAccount).toHaveBeenCalledTimes(1);
          expect(stripeService.deleteBankAccount).toHaveBeenCalledWith(
            customerId,
            bankAccountId,
          );
        });
      });
    });
  });
});
