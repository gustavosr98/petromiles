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

        it('should return the info of the Stripe', () => {
          expect(result).toStrictEqual(expectedResult);
        });
      });
    });
  });
});
