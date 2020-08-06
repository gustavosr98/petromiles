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
          amounts = [100, 150];

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
          expect(stripe.customers.verifySource).toHaveBeenCalledWith(
            customerId,
            bankAccountId,
            { amounts },
          );
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
});
