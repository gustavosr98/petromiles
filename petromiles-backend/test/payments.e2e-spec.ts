import { AuthGuard } from '@nestjs/passport';
import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication, HttpStatus, ExecutionContext } from '@nestjs/common';

import { AppModule } from '@/app.module';

describe('E2E', () => {
  let app: INestApplication;
  let user = { id: 1, email: 'test@petromiles.com' };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(AuthGuard('jwt'))
      .useValue({
        canActivate: (context: ExecutionContext) => {
          const req = context.switchToHttp().getRequest();
          req.user = user;
          return true;
        },
      })
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  describe(`POST /payments/buy-points`, () => {
    let idClientBankAccount;
    let amount;
    let amountToCharge;
    let points;
    let subscriptionName;
    let infoSubscription;
    let paymentProperties;

    beforeEach(async () => {
      idClientBankAccount = 1;
      amount = 200;
      amountToCharge = 295;
      points = '1000';
      subscriptionName = 'basic';
      infoSubscription = {};

      paymentProperties = {
        idClientBankAccount,
        amount,
        amountToCharge,
        points,
        subscriptionName,
        infoSubscription,
      };
    });

    it(`should return the search result`, async () => {
      return await request(app.getHttpServer())
        .post(`/payments/buy-points`)
        .send(paymentProperties)
        .expect(HttpStatus.CREATED)
        .then(res => {
          expect(res.body).toStrictEqual(
            expect.objectContaining({
              totalAmountWithInterest: expect.any(Number),
              rawAmount: expect.any(Number),
              type: expect.any(String),
              pointsConversion: expect.anything(),
              clientBankAccount: expect.anything(),
              thirdPartyInterest: expect.anything(),
              platformInterest: expect.anything(),
              stateTransactionDescription: expect.any(String),
              operation: expect.any(Number),
              paymentProviderTransactionId: expect.any(String),
              idTransaction: expect.any(Number),
              initialDate: expect.any(String),
            }),
          );
        });
    });
  });

  describe(`POST /payments/withdraw-points`, () => {
    let idClientBankAccount;
    let amount;
    let amountToCharge;
    let points;
    let paymentProperties;

    beforeEach(async () => {
      idClientBankAccount = 1;
      amount = 100;
      amountToCharge = 20;
      points = '500';

      paymentProperties = {
        idClientBankAccount,
        amount,
        amountToCharge,
        points,
      };
    });

    it(`should return the search result`, async () => {
      return await request(app.getHttpServer())
        .post(`/payments/withdraw-points`)
        .send(paymentProperties)
        .expect(HttpStatus.CREATED)
        .then(res => {
          expect(res.body).toStrictEqual(
            expect.objectContaining({
              totalAmountWithInterest: expect.any(Number),
              rawAmount: expect.any(Number),
              type: expect.any(String),
              pointsConversion: expect.anything(),
              clientBankAccount: expect.anything(),
              thirdPartyInterest: expect.anything(),
              platformInterest: expect.anything(),
              stateTransactionDescription: expect.any(String),
              operation: expect.any(Number),
              paymentProviderTransactionId: expect.any(String),
              idTransaction: expect.any(Number),
              initialDate: expect.any(String),
            }),
          );
        });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
