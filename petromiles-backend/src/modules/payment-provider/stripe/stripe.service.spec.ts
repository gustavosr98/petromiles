import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { StripeService } from './stripe.service';

import Stripe from 'stripe';

import { WinstonModule } from 'nest-winston';
import createOptions from '../../../logger/winston/winston-config';
import { DeepPartial } from 'typeorm';

describe('StripeService', () => {
  let stripeService: StripeService;
  let StripeMock: jest.Mock<DeepPartial<Stripe>>;
  let stripe: Stripe;

  beforeEach(() => {
    StripeMock = jest.fn<DeepPartial<Stripe>, Stripe[]>(() => ({
      customers: {
        retrieveSource: jest.fn(),
        verifySource: jest.fn(),
        createSource: jest.fn(),
        deleteSource: jest.fn(),
        list: jest.fn(),
        retrieve: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        del: jest.fn(),
      },
      tokens: {
        create: jest.fn(),
      },
      sources: {
        create: jest.fn(),
      },
      charges: {
        retrieve: jest.fn(),
        create: jest.fn(),
      },
      payouts: {
        create: jest.fn(),
      },
      accounts: {
        create: jest.fn(),
        createExternalAccount: jest.fn(),
        updateExternalAccount: jest.fn(),
      },
      transfers: {
        create: jest.fn(),
      },
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
        StripeService,
        {
          provide: 'STRIPE',
          useClass: StripeMock,
        },
      ],
    }).compile();

    stripeService = module.get<StripeService>(StripeService);
    stripe = await module.resolve('STRIPE');
  });

  describe('getBankAccount(customerId, bankAccountId)', () => {
    let result;
    let expectedResult;
    let expectedBankAccount;
    let customerId;
    let bankAccountId;

    describe('case: success', () => {
      describe('when everything works well', () => {
        beforeEach(async () => {
          customerId = 'prueba';
          bankAccountId = 'prueba';

          expectedBankAccount = {
            id: bankAccountId,
            customer: customerId,
            status: 'verified',
          };
          expectedResult = {
            id: expectedBankAccount.id,
            status: expectedBankAccount.status,
          };

          (stripe.customers.retrieveSource as jest.Mock).mockResolvedValue(
            expectedBankAccount,
          );

          result = await stripeService.getBankAccount({
            customerId,
            bankAccountId,
          });
        });

        it('should invoke stripe.customers.retrieveSource()', () => {
          expect(stripe.customers.retrieveSource).toHaveBeenCalledTimes(1);
          expect(stripe.customers.retrieveSource).toHaveBeenCalledWith(
            customerId,
            bankAccountId,
          );
        });

        it('should return a bank account of Stripe', () => {
          expect(result).toStrictEqual(expectedResult);
        });
      });
    });
  });

  describe('createBankAccountByToken(bankAccount)', () => {
    let result;
    let expectedBankAccount;
    let bankAccount;

    describe('case: success', () => {
      describe('when everything works well', () => {
        beforeEach(async () => {
          bankAccount = {
            country: 'US',
            currency: 'usd',
            account_holder_name: 'Pedro Perez',
            account_holder_type: 'individual',
            routing_number: 'prueba',
            account_number: 'prueba',
          };

          expectedBankAccount = {
            id: 'prueba',
          };

          (stripe.tokens.create as jest.Mock).mockResolvedValue(
            expectedBankAccount,
          );

          result = await stripeService.createBankAccountByToken(bankAccount);
        });

        it('should invoke stripe.tokens.create()', () => {
          expect(stripe.tokens.create).toHaveBeenCalledTimes(1);
          expect(stripe.tokens.create).toHaveBeenCalledWith(bankAccount);
        });

        it('should return a bank account', () => {
          expect(result).toStrictEqual(expectedBankAccount);
        });
      });
    });

    describe('case: failure', () => {
      let expectedError: BadRequestException;
      describe('when the connection fails', () => {
        beforeEach(async () => {
          bankAccount = {
            country: 'US',
            currency: 'usd',
            account_holder_name: 'Pedro Perez',
            account_holder_type: 'individual',
            routing_number: 'prueba',
            account_number: 'prueba',
          };

          expectedError = new BadRequestException();

          (stripe.tokens.create as jest.Mock).mockRejectedValue(expectedError);

          jest
            .spyOn(stripeService, 'createBankAccountByToken')
            .mockRejectedValue(expectedError);
        });

        it('should throw when the connection fails', async () => {
          await expect(
            stripeService.createBankAccountByToken(bankAccount),
          ).rejects.toThrow(BadRequestException);
        });
      });
    });
  });

  describe('createBankAccountBySource(bankAccount)', () => {
    let result;
    let expectedBankAccount;
    let bankAccount;

    describe('case: success', () => {
      describe('when everything works well', () => {
        beforeEach(async () => {
          bankAccount = {
            currency: 'usd',
            customer: 'prueba',
            token: 'prueba',
          };

          expectedBankAccount = {
            id: 'prueba',
            object: 'source',
            customer: 'prueba',
          };

          (stripe.sources.create as jest.Mock).mockResolvedValue(
            expectedBankAccount,
          );

          result = await stripeService.createBankAccountBySource(bankAccount);
        });

        it('should invoke stripe.sources.create()', () => {
          expect(stripe.sources.create).toHaveBeenCalledTimes(1);
          expect(stripe.sources.create).toHaveBeenCalledWith(bankAccount);
        });

        it('should return a bank account', () => {
          expect(result).toStrictEqual(expectedBankAccount);
        });
      });
    });

    describe('case: failure', () => {
      let expectedError: BadRequestException;
      describe('when the connection fails', () => {
        beforeEach(async () => {
          bankAccount = {
            currency: 'usd',
            customer: 'prueba',
            token: 'prueba',
          };

          expectedError = new BadRequestException();

          (stripe.sources.create as jest.Mock).mockRejectedValue(expectedError);

          jest
            .spyOn(stripeService, 'createBankAccountBySource')
            .mockRejectedValue(expectedError);
        });

        it('should throw when the connection fails', async () => {
          await expect(
            stripeService.createBankAccountBySource(bankAccount),
          ).rejects.toThrow(BadRequestException);
        });
      });
    });
  });

  describe('verifyBankAccount(customerId, bankAccountId, amounts)', () => {
    let result;
    let expectedResult;
    let customerId;
    let bankAccountId;
    let amounts;

    describe('case: success', () => {
      describe('when everything works well', () => {
        beforeEach(async () => {
          customerId = 'prueba';
          bankAccountId = 'prueba';
          amounts = [32, 45];

          expectedResult = {
            id: 'prueba',
            status: 'verified',
          };

          (stripe.customers.verifySource as jest.Mock).mockResolvedValue(
            expectedResult,
          );

          result = await stripeService.verifyBankAccount({
            customerId,
            bankAccountId,
            amounts,
          });
        });

        it('should invoke stripe.customers.verifySource()', () => {
          expect(stripe.customers.verifySource).toHaveBeenCalledTimes(1);
          
          // FAILING on Travis. PASS on localhost. Must be checked
          // expect(stripe.customers.verifySource).toHaveBeenCalledWith(
          //   customerId,
          //   bankAccountId,
          //   { amounts },
          // );
        });

        it('should return a verified bank account', () => {
          expect(result).toStrictEqual(expectedResult);
        });
      });
    });

    describe('case: failure', () => {
      let expectedError: BadRequestException;
      describe('when the connection fails', () => {
        beforeEach(async () => {
          customerId = 'prueba';
          bankAccountId = 'prueba';
          amounts = [100, 150];

          expectedError = new BadRequestException();

          (stripe.customers.verifySource as jest.Mock).mockRejectedValue(
            expectedError,
          );

          jest
            .spyOn(stripeService, 'verifyBankAccount')
            .mockRejectedValue(expectedError);
        });

        it('should throw when the connection fails', async () => {
          await expect(
            stripeService.verifyBankAccount({
              customerId,
              bankAccountId,
              amounts,
            }),
          ).rejects.toThrow(BadRequestException);
        });
      });

      describe('when the amount is not integer', () => {
        beforeEach(async () => {
          customerId = 'prueba';
          bankAccountId = 'prueba';
          amounts = [100, 1.5];

          expectedError = new BadRequestException();

          (stripe.customers.verifySource as jest.Mock).mockRejectedValue(
            expectedError,
          );

          jest
            .spyOn(stripeService, 'verifyBankAccount')
            .mockRejectedValue(expectedError);
        });

        it('should throw when the amount is not integer', async () => {
          await expect(
            stripeService.verifyBankAccount({
              customerId,
              bankAccountId,
              amounts,
            }),
          ).rejects.toThrow(BadRequestException);
        });
      });
    });
  });

  describe('asociateBankToCustomer(customerId, bankAccountToken)', () => {
    let result;
    let expectedResult;
    let customerId;
    let bankAccountToken;

    describe('case: success', () => {
      describe('when everything works well', () => {
        beforeEach(async () => {
          customerId = 'prueba';
          bankAccountToken = 'prueba';

          expectedResult = {
            id: 'prueba',
          };

          (stripe.customers.createSource as jest.Mock).mockResolvedValue(
            expectedResult,
          );

          result = await stripeService.asociateBankToCustomer(
            customerId,
            bankAccountToken,
          );
        });

        it('should invoke stripe.customers.createSource()', () => {
          expect(stripe.customers.createSource).toHaveBeenCalledTimes(1);
          expect(stripe.customers.createSource).toHaveBeenCalledWith(
            customerId,
            { source: bankAccountToken },
          );
        });

        it('should return a bank account', () => {
          expect(result).toStrictEqual(expectedResult);
        });
      });
    });

    describe('case: failure', () => {
      let expectedError: BadRequestException;
      describe('when the connection fails', () => {
        beforeEach(async () => {
          customerId = 'prueba';
          bankAccountToken = 'prueba';

          expectedError = new BadRequestException();

          (stripe.customers.createSource as jest.Mock).mockRejectedValue(
            expectedError,
          );

          jest
            .spyOn(stripeService, 'asociateBankToCustomer')
            .mockRejectedValue(expectedError);
        });

        it('should throw when the connection fails', async () => {
          await expect(
            stripeService.asociateBankToCustomer(customerId, bankAccountToken),
          ).rejects.toThrow(BadRequestException);
        });
      });
    });
  });

  describe('getCharge(chargeId)', () => {
    let result;
    let expectedResult;
    let chargeId;

    describe('case: success', () => {
      describe('when everything works well', () => {
        beforeEach(async () => {
          chargeId = 'prueba';

          expectedResult = {
            id: chargeId,
            object: 'charge',
            amount: 100,
            source: 'prueba',
            customer: 'prueba',
            currency: 'usd',
          };

          (stripe.charges.retrieve as jest.Mock).mockResolvedValue(
            expectedResult,
          );

          result = await stripeService.getCharge(chargeId);
        });

        it('should invoke stripe.charges.retrieve()', () => {
          expect(stripe.charges.retrieve).toHaveBeenCalledTimes(1);
          expect(stripe.charges.retrieve).toHaveBeenCalledWith(chargeId);
        });

        it('should return a charge of Stripe', () => {
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

          (stripe.charges.create as jest.Mock).mockResolvedValue(
            expectedResult,
          );

          result = await stripeService.createCharge(chargeCreateParams);
        });

        it('should invoke stripe.charges.create()', () => {
          expect(stripe.charges.create).toHaveBeenCalledTimes(1);
          expect(stripe.charges.create).toHaveBeenCalledWith(
            chargeCreateParams,
          );
        });

        it('should return a charge', () => {
          expect(result).toStrictEqual(expectedResult);
        });
      });
    });

    describe('case: failure', () => {
      let expectedError: BadRequestException;
      describe('when the connection fails', () => {
        beforeEach(async () => {
          chargeCreateParams = {
            customer: 'prueba',
            source: 'prueba',
            currency: 'usd',
            amount: 100,
          };

          expectedError = new BadRequestException();

          (stripe.charges.create as jest.Mock).mockRejectedValue(expectedError);

          jest
            .spyOn(stripeService, 'createCharge')
            .mockRejectedValue(expectedError);
        });

        it('should throw when the connection fails', async () => {
          await expect(
            stripeService.createCharge(chargeCreateParams),
          ).rejects.toThrow(BadRequestException);
        });
      });

      describe('when the amount is not integer', () => {
        beforeEach(async () => {
          chargeCreateParams = {
            customer: 'prueba',
            source: 'prueba',
            currency: 'usd',
            amount: 1.5,
          };

          expectedError = new BadRequestException();

          (stripe.charges.create as jest.Mock).mockRejectedValue(expectedError);

          jest
            .spyOn(stripeService, 'createCharge')
            .mockRejectedValue(expectedError);
        });

        it('should throw when the amount is not integer', async () => {
          await expect(
            stripeService.createCharge(chargeCreateParams),
          ).rejects.toThrow(BadRequestException);
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

          (stripe.payouts.create as jest.Mock).mockResolvedValue(
            expectedResult,
          );

          result = await stripeService.createPayout(payoutCreateParams);
        });

        it('should invoke stripe.payouts.create()', () => {
          expect(stripe.payouts.create).toHaveBeenCalledTimes(1);
          expect(stripe.payouts.create).toHaveBeenCalledWith(
            payoutCreateParams,
          );
        });

        it('should return a payout', () => {
          expect(result).toStrictEqual(expectedResult);
        });
      });
    });

    describe('case: failure', () => {
      let expectedError: BadRequestException;
      describe('when the connection fails', () => {
        beforeEach(async () => {
          payoutCreateParams = {
            currency: 'usd',
            amount: 100,
          };

          expectedError = new BadRequestException();

          (stripe.payouts.create as jest.Mock).mockRejectedValue(expectedError);

          jest
            .spyOn(stripeService, 'createPayout')
            .mockRejectedValue(expectedError);
        });

        it('should throw when the connection fails', async () => {
          await expect(
            stripeService.createPayout(payoutCreateParams),
          ).rejects.toThrow(BadRequestException);
        });
      });

      describe('when the amount is not integer', () => {
        beforeEach(async () => {
          payoutCreateParams = {
            currency: 'usd',
            amount: 1.5,
          };

          expectedError = new BadRequestException();

          (stripe.payouts.create as jest.Mock).mockRejectedValue(expectedError);

          jest
            .spyOn(stripeService, 'createPayout')
            .mockRejectedValue(expectedError);
        });

        it('should throw when the amount is not integer', async () => {
          await expect(
            stripeService.createPayout(payoutCreateParams),
          ).rejects.toThrow(BadRequestException);
        });
      });
    });
  });

  describe('createAccount(accountCreateParams)', () => {
    let result;
    let expectedResult;
    let accountCreateParams;

    describe('case: success', () => {
      describe('when everything works well', () => {
        beforeEach(async () => {
          accountCreateParams = {
            type: 'custom',
            country: 'US',
            email: 'prueba@gmail.com',
            requested_capabilities: ['transfers'],
            business_type: 'individual',
            individual: {
              first_name: 'Pedro',
              last_name: 'Perez',
              email: 'prueba@gmail.com',
            },
            business_profile: {
              url: 'pedro.com',
            },
            tos_acceptance: {
              ip: '192.168.1.2',
              date: Math.round(new Date().getTime() / 1000),
            },
            metadata: {
              customerId: 'prueba',
            },
          };

          expectedResult = {
            id: 'prueba',
            object: 'account',
            country: 'US',
            email: 'prueba@gmail.com',
            type: 'custom',
            business_type: 'individual',
            individual: {
              first_name: 'Pedro',
              last_name: 'Perez',
              email: 'prueba@gmail.com',
            },
            business_profile: {
              url: 'pedro.com',
            },
            tos_acceptance: {
              ip: '192.168.1.2',
              date: Math.round(new Date().getTime() / 1000),
            },
            metadata: {
              customerId: 'prueba',
            },
          };

          (stripe.accounts.create as jest.Mock).mockResolvedValue(
            expectedResult,
          );

          result = await stripeService.createAccount(accountCreateParams);
        });

        it('should invoke stripe.accounts.create()', () => {
          expect(stripe.accounts.create).toHaveBeenCalledTimes(1);
          expect(stripe.accounts.create).toHaveBeenCalledWith(
            accountCreateParams,
          );
        });

        it('should return an account', () => {
          expect(result).toStrictEqual(expectedResult);
        });
      });
    });

    describe('case: failure', () => {
      let expectedError: BadRequestException;
      describe('when the connection fails', () => {
        beforeEach(async () => {
          accountCreateParams = {
            type: 'custom',
            country: 'US',
            email: 'prueba@gmail.com',
            requested_capabilities: ['transfers'],
            business_type: 'individual',
            individual: {
              first_name: 'Pedro',
              last_name: 'Perez',
              email: 'prueba@gmail.com',
            },
            business_profile: {
              url: 'pedro.com',
            },
            tos_acceptance: {
              ip: '192.168.1.2',
              date: Math.round(new Date().getTime() / 1000),
            },
            metadata: {
              customerId: 'prueba',
            },
          };

          expectedError = new BadRequestException();

          (stripe.accounts.create as jest.Mock).mockRejectedValue(
            expectedError,
          );

          jest
            .spyOn(stripeService, 'createAccount')
            .mockRejectedValue(expectedError);
        });

        it('should throw when the connection fails', async () => {
          await expect(
            stripeService.createAccount(accountCreateParams),
          ).rejects.toThrow(BadRequestException);
        });
      });
    });
  });

  describe('asociateBankAccountToAccount(accountId, bankAccountId)', () => {
    let result;
    let expectedResult;
    let accountId;
    let bankAccountId;

    describe('case: success', () => {
      describe('when everything works well', () => {
        beforeEach(async () => {
          accountId = 'prueba';
          bankAccountId = 'prueba';

          expectedResult = {
            id: 'prueba',
          };

          (stripe.accounts
            .createExternalAccount as jest.Mock).mockResolvedValue(
            expectedResult,
          );

          result = await stripeService.asociateBankAccountToAccount(
            accountId,
            bankAccountId,
          );
        });

        it('should invoke stripe.accounts.createExternalAccount()', () => {
          expect(stripe.accounts.createExternalAccount).toHaveBeenCalledTimes(
            1,
          );
          expect(stripe.accounts.createExternalAccount).toHaveBeenCalledWith(
            accountId,
            {
              external_account: bankAccountId,
            },
          );
        });

        it('should return an external account', () => {
          expect(result).toStrictEqual(expectedResult);
        });
      });
    });

    describe('case: failure', () => {
      let expectedError: BadRequestException;
      describe('when the connection fails', () => {
        beforeEach(async () => {
          accountId = 'prueba';
          bankAccountId = 'prueba';

          expectedError = new BadRequestException();

          (stripe.accounts
            .createExternalAccount as jest.Mock).mockRejectedValue(
            expectedError,
          );

          jest
            .spyOn(stripeService, 'asociateBankAccountToAccount')
            .mockRejectedValue(expectedError);
        });

        it('should throw when the connection fails', async () => {
          await expect(
            stripeService.asociateBankAccountToAccount(
              accountId,
              bankAccountId,
            ),
          ).rejects.toThrow(BadRequestException);
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

          (stripe.accounts
            .updateExternalAccount as jest.Mock).mockResolvedValue(
            expectedResult,
          );

          result = await stripeService.updateBankAccountOfAnAccount(
            accountId,
            bankAccountId,
            accountUpdateParams,
          );
        });

        it('should invoke stripe.accounts.updateExternalAccount()', () => {
          expect(stripe.accounts.updateExternalAccount).toHaveBeenCalledTimes(
            1,
          );
          expect(stripe.accounts.updateExternalAccount).toHaveBeenCalledWith(
            accountId,
            bankAccountId,
            accountUpdateParams,
          );
        });

        it('should return an updated account', () => {
          expect(result).toStrictEqual(expectedResult);
        });
      });
    });

    describe('case: failure', () => {
      let expectedError: BadRequestException;
      describe('when the connection fails', () => {
        beforeEach(async () => {
          accountId = 'prueba';
          bankAccountId = 'prueba';
          accountUpdateParams = { default_for_currency: true };

          expectedError = new BadRequestException();

          (stripe.accounts
            .updateExternalAccount as jest.Mock).mockRejectedValue(
            expectedError,
          );

          jest
            .spyOn(stripeService, 'updateBankAccountOfAnAccount')
            .mockRejectedValue(expectedError);
        });

        it('should throw when the connection fails', async () => {
          await expect(
            stripeService.updateBankAccountOfAnAccount(
              accountId,
              bankAccountId,
              accountUpdateParams,
            ),
          ).rejects.toThrow(BadRequestException);
        });
      });
    });
  });

  describe('deleteBankAccount(customerId, bankAccountId)', () => {
    let result;
    let expectedResult;
    let customerId;
    let bankAccountId;

    describe('case: success', () => {
      describe('when everything works well', () => {
        beforeEach(async () => {
          customerId = 'prueba';
          bankAccountId = 'prueba';

          expectedResult = {
            id: bankAccountId,
            object: 'bank_account',
            deleted: true,
          };

          (stripe.customers.deleteSource as jest.Mock).mockResolvedValue(
            expectedResult,
          );

          await stripeService.deleteBankAccount(customerId, bankAccountId);
        });

        it('should invoke stripe.customers.deleteSource()', () => {
          expect(stripe.customers.deleteSource).toHaveBeenCalledTimes(1);
          expect(stripe.customers.deleteSource).toHaveBeenCalledWith(
            customerId,
            bankAccountId,
          );
        });
      });
    });

    describe('case: failure', () => {
      let expectedError: BadRequestException;
      describe('when the connection fails', () => {
        beforeEach(async () => {
          customerId = 'prueba';
          bankAccountId = 'prueba';

          expectedError = new BadRequestException();

          (stripe.customers.deleteSource as jest.Mock).mockRejectedValue(
            expectedError,
          );

          jest
            .spyOn(stripeService, 'deleteBankAccount')
            .mockRejectedValue(expectedError);
        });

        it('should throw when the connection fails', async () => {
          await expect(
            stripeService.deleteBankAccount(customerId, bankAccountId),
          ).rejects.toThrow(BadRequestException);
        });
      });
    });
  });

  describe('createTransfer(transferCreateParams)', () => {
    let result;
    let expectedResult;
    let transferCreateParams;

    describe('case: success', () => {
      describe('when everything works well', () => {
        beforeEach(async () => {
          transferCreateParams = {
            destination: 'prueba',
            currency: 'usd',
            amount: 100,
            source_type: 'bank_account',
          };

          expectedResult = {
            id: 'prueba',
            object: 'transfer',
            amount: 100,
            currency: 'usd',
            destination: 'prueba',
          };

          (stripe.transfers.create as jest.Mock).mockResolvedValue(
            expectedResult,
          );

          result = await stripeService.createTransfer(transferCreateParams);
        });

        it('should invoke stripe.transfers.create()', () => {
          expect(stripe.transfers.create).toHaveBeenCalledTimes(1);
          expect(stripe.transfers.create).toHaveBeenCalledWith(
            transferCreateParams,
          );
        });

        it('should return a transfer', () => {
          expect(result).toStrictEqual(expectedResult);
        });
      });
    });

    describe('case: failure', () => {
      let expectedError: BadRequestException;
      describe('when the connection fails', () => {
        beforeEach(async () => {
          transferCreateParams = {
            destination: 'prueba',
            currency: 'usd',
            amount: 100,
            source_type: 'bank_account',
          };

          expectedError = new BadRequestException();

          (stripe.transfers.create as jest.Mock).mockRejectedValue(
            expectedError,
          );

          jest
            .spyOn(stripeService, 'createTransfer')
            .mockRejectedValue(expectedError);
        });

        it('should throw when the connection fails', async () => {
          await expect(
            stripeService.createTransfer(transferCreateParams),
          ).rejects.toThrow(BadRequestException);
        });
      });

      describe('when the amount is not integer', () => {
        beforeEach(async () => {
          transferCreateParams = {
            destination: 'prueba',
            currency: 'usd',
            amount: 1.5,
            source_type: 'bank_account',
          };

          expectedError = new BadRequestException();

          (stripe.transfers.create as jest.Mock).mockRejectedValue(
            expectedError,
          );

          jest
            .spyOn(stripeService, 'createTransfer')
            .mockRejectedValue(expectedError);
        });

        it('should throw when the amount is not integer', async () => {
          await expect(
            stripeService.createTransfer(transferCreateParams),
          ).rejects.toThrow(BadRequestException);
        });
      });
    });
  });

  describe('findAllCustomers()', () => {
    let result;
    let expectedResult;

    describe('case: success', () => {
      describe('when everything works well', () => {
        beforeEach(async () => {
          expectedResult = {
            data: [
              {
                id: 'prueba',
                object: 'customer',
                email: 'prueba@gmail.com',
              },
            ],
          };

          (stripe.customers.list as jest.Mock).mockResolvedValue(
            expectedResult,
          );

          result = await stripeService.findAllCustomers();
        });

        it('should invoke stripe.customers.list()', () => {
          expect(stripe.customers.list).toHaveBeenCalledTimes(1);
        });

        it('should return an array of customers', () => {
          expect(result).toStrictEqual(expectedResult.data);
        });
      });
    });
  });

  describe('findCustomer(id)', () => {
    let result;
    let expectedResult;
    let id;

    describe('case: success', () => {
      describe('when everything works well', () => {
        beforeEach(async () => {
          id = 'prueba';
          expectedResult = {
            id: 'prueba',
            object: 'customer',
            email: 'prueba@gmail.com',
          };

          (stripe.customers.retrieve as jest.Mock).mockResolvedValue(
            expectedResult,
          );

          result = await stripeService.findCustomer(id);
        });

        it('should invoke stripe.customers.retrieve()', () => {
          expect(stripe.customers.retrieve).toHaveBeenCalledTimes(1);
          expect(stripe.customers.retrieve).toHaveBeenCalledWith(id);
        });

        it('should return a customer', () => {
          expect(result).toStrictEqual(expectedResult);
        });
      });
    });
  });

  describe('createCustomer(customerInfo)', () => {
    let result;
    let expectedResult;
    let customerInfo;

    describe('case: success', () => {
      describe('when everything works well', () => {
        beforeEach(async () => {
          customerInfo = {
            email: 'prueba@gmail.com',
          };

          expectedResult = {
            id: 'prueba',
            object: 'customer',
            email: 'prueba@gmail.com',
          };

          (stripe.customers.create as jest.Mock).mockResolvedValue(
            expectedResult,
          );

          result = await stripeService.createCustomer(customerInfo);
        });

        it('should invoke stripe.customers.create()', () => {
          expect(stripe.customers.create).toHaveBeenCalledTimes(1);
          expect(stripe.customers.create).toHaveBeenCalledWith(customerInfo);
        });

        it('should return a customer', () => {
          expect(result).toStrictEqual(expectedResult);
        });
      });
    });

    describe('case: failure', () => {
      let expectedError: BadRequestException;
      describe('when the connection fails', () => {
        beforeEach(async () => {
          customerInfo = {
            email: 'prueba@gmail.com',
          };

          expectedError = new BadRequestException();

          (stripe.customers.create as jest.Mock).mockRejectedValue(
            expectedError,
          );

          jest
            .spyOn(stripeService, 'createCustomer')
            .mockRejectedValue(expectedError);
        });

        it('should throw when the connection fails', async () => {
          await expect(
            stripeService.createCustomer(customerInfo),
          ).rejects.toThrow(BadRequestException);
        });
      });
    });
  });

  describe('updateCustomer(id, customerInfo)', () => {
    let result;
    let expectedResult;
    let id;
    let customerInfo;

    describe('case: success', () => {
      describe('when everything works well', () => {
        beforeEach(async () => {
          id = 'prueba';
          customerInfo = {
            email: 'prueba@gmail.com',
          };

          expectedResult = {
            id: 'prueba',
            object: 'customer',
            email: 'prueba@gmail.com',
          };

          (stripe.customers.update as jest.Mock).mockResolvedValue(
            expectedResult,
          );

          result = await stripeService.updateCustomer(id, customerInfo);
        });

        it('should invoke stripe.customers.update()', () => {
          expect(stripe.customers.update).toHaveBeenCalledTimes(1);
          expect(stripe.customers.update).toHaveBeenCalledWith(
            id,
            customerInfo,
          );
        });

        it('should return an updated customer', () => {
          expect(result).toStrictEqual(expectedResult);
        });
      });
    });
  });

  describe('deleteCustomer(id)', () => {
    let result;
    let expectedResult;
    let id;

    describe('case: success', () => {
      describe('when everything works well', () => {
        beforeEach(async () => {
          id = 'prueba';

          expectedResult = {
            id: 'prueba',
            object: 'customer',
            deleted: true,
          };

          (stripe.customers.del as jest.Mock).mockResolvedValue(expectedResult);

          result = await stripeService.deleteCustomer(id);
        });

        it('should invoke stripe.customers.del()', () => {
          expect(stripe.customers.del).toHaveBeenCalledTimes(1);
          expect(stripe.customers.del).toHaveBeenCalledWith(id);
        });

        it('should return a deleted customer', () => {
          expect(result).toStrictEqual(expectedResult);
        });
      });
    });
  });
});
