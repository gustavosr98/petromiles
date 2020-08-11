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
import { IsNumber } from 'class-validator';
import { AppModule } from '@/app.module';

describe('Transaction', () => {
  let app: INestApplication;
  let transactionService: TransactionService;
  let transactions;
  let baseEndpoint: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    baseEndpoint = Object.freeze('/transaction');
    //transactionService = module.get<TransactionService>(TransactionService);
    app = moduleRef.createNestApplication();
    await app.init();
  });

  describe(`GET ${baseEndpoint}/:idTransaction`, () => {
    let idTransaction: number = 1;

    it(`should return the search result`, async () => {
      return request(app.getHttpServer())
        .get(`${baseEndpoint}/${idTransaction}`)
        .expect(200)
        .then(res => {
          console.log(res.body);
          expect(res.body).toStrictEqual(
            expect.objectContaining({
              id: expect(idTransaction),
              date: expect.any(String),
              fullDate: expect.any(String),
              type: expect.any(TransactionType),
              bankAccount: expect.any(String),
              bankAccountNickname: expect.any(String),
              clientBankAccountEmail: expect.any(String),
              thirdPartyClient: expect(null),
              pointsConversion: expect.any(Number),
              amount: expect.any(Number),
              interest: expect.any(Number),
              total: expect.any(Number),
              state: expect.any(String),
            }),
          );
        });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
