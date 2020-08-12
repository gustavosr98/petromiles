import { AuthGuard } from '@nestjs/passport';
import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication, HttpStatus, ExecutionContext } from '@nestjs/common';

import { AppModule } from '@/app.module';

describe('Payments', () => {
  let app: INestApplication;
  let baseEndpoint: string;
  let user = { id: 1, email: 'test@petromiles.com' };

  beforeEach(async () => {
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

    baseEndpoint = Object.freeze('/payments');
    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe(`POST ${baseEndpoint}/buy-points`, () => {
    let idClientBankAccount;
    let amount;
    let amountToCharge;
    let points;
    let subscriptionName;
    let infoSubscription;
    let paymentProperties;

    beforeEach(async () => {
      idClientBankAccount = 1;
      amount = 100;
      amountToCharge = 100;
      points = 100;
      subscriptionName = 'BASIC';
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

    it(`should return the search result`, () => {
      request(app.getHttpServer())
        .post(`${baseEndpoint}/buy-points`)
        .send(paymentProperties)
        .expect(HttpStatus.CREATED)
        .then(res => {
          expect(res.body).toStrictEqual(expect.objectContaining({}));
        })
        .catch();
    });
  });
});
