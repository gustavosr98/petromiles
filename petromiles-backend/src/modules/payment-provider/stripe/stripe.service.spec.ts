import { Test, TestingModule } from '@nestjs/testing';
import { StripeService } from './stripe.service';

import Stripe from 'stripe';

import { WinstonModule } from 'nest-winston';
import createOptions from '../../../logger/winston/winston-config';
import { DeepPartial } from 'typeorm';

describe('StripeService', () => {
  let stripeService: StripeService;
  let StripeMock: jest.Mock<DeepPartial<Stripe>>;

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
          provide: Stripe,
          useClass: StripeMock,
        },
      ],
    }).compile();

    stripeService = module.get<StripeService>(StripeService);
  });
});
