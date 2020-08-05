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
});
