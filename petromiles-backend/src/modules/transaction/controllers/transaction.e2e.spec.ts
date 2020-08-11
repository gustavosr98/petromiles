import { UserRole } from '@/entities/user-role.entity';
import { UserClient } from '@/entities/user-client.entity';
import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TransactionModule } from '@/modules/transaction/transaction.module';
import { TransactionService } from '@/modules/transaction/services/transaction.service';

import { TransactionType } from '@/enums/transaction.enum';
import { StateDescription } from '@/enums/state.enum';

// MODULES
import { ManagementModule } from '@/modules/management/management.module';
import { PaymentProviderModule } from '@/modules/payment-provider/payment-provider.module';

// ENTITIES
import { Transaction } from '@/entities/transaction.entity';
import { TransactionInterest } from '@/entities/transaction-interest.entity';
import { StateTransaction } from '@/entities/state-transaction.entity';

describe('Transaction', () => {
  let app: INestApplication;
  let transactionService;
  let transactions;

  beforeAll(async () => {
    const expectedPointsConversion = {
      idPointsConversion: 1,
      onePointEqualsDollars: 0.002,
      initialDate: new Date(),
      finalDate: null,
    };
    const expectedPlatformInterest = { amount: 200, percentage: 0 };
    const expectedThirdPartyInterest = {
      amountDollarCents: 75,
      percentage: 0,
    };
    transactions = [
      {
        totalAmountWithInterest: 100,
        rawAmount: 0,
        type: TransactionType.DEPOSIT,
        pointsConversion: expectedPointsConversion,
        platformInterest: expectedPlatformInterest,
        stateTransactionDescription: StateDescription.DEPOSIT,
        thirdPartyInterest: expectedThirdPartyInterest,
        promotion: null,
        platformInterestExtraPoints: null,
      },
    ];

    transactionService = { findAll: () => transactions };
  });

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        TransactionModule,
        PaymentProviderModule,
        ManagementModule,
        TypeOrmModule.forFeature([
          Transaction,
          TransactionInterest,
          StateTransaction,
          UserClient,
          UserRole,
        ]),
      ],
    })
      .overrideProvider(TransactionService)
      .useValue(transactionService)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it(`/GET transaction`, () => {
    return request(app.getHttpServer())
      .get('/transaction/admin/list/all')
      .expect(200)
      .expect({
        data: transactionService.findAll(),
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
