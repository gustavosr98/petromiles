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
});
