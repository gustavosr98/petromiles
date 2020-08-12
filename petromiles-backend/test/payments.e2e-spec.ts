import { AuthGuard } from '@nestjs/passport';
import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication, HttpStatus, ExecutionContext } from '@nestjs/common';

import { AppModule } from '@/app.module';
import { stringify } from 'querystring';
import { isNumber } from 'util';

describe('Payments', () => {
  let app: INestApplication;
  let baseEndpoint: string;
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

    baseEndpoint = Object.freeze('/payments');
    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
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
      amount = 200;
      amountToCharge = 295;
      points = '1000';
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
        .post(`/payments/buy-points`)
        .send(paymentProperties)
        .expect(HttpStatus.CREATED)
        .then(res => {
          console.log(baseEndpoint);
          console.log(res.body);
          expect(res.body).toStrictEqual(
            expect.objectContaining({
              totalAmountWithInterest: expect.any(Number),
              rawAmount: expect.any(Number),
              type: expect.any(String),
              pointsConversion: expect.objectContaining({
                idPointsConversion: expect.any(Number),
                onePointEqualsDollars: expect.any(String),
                initialDate: expect.any(Date),
                finalDate: null,
              }),
              clientBankAccount: expect.objectContaining({
                idClientBankAccount: expect.any(Number),
                paymentProvider: expect.any(String),
                chargeId: expect.any(String),
                primary: expect.any(Boolean),
                transferId: expect.any(String),
                userClient: expect.objectContaining({
                  idUserClient: expect.any(Number),
                  salt: null,
                  googleToken: null,
                  facebookToken: null,
                  email: expect.any(String),
                  password: null,
                  stateUser: expect.any(Array),
                  userDetails: expect.any(Array),
                  userSuscription: expect.any(Array),
                }),
                bankAccount: expect.objectContaining({
                  idBankAccount: expect.any(Number),
                  accountNumber: expect.any(String),
                  checkNumber: expect.any(String),
                  nickname: expect.any(String),
                  type: expect.any(String),
                  routingNumber: expect.any(Array),
                }),
                stateBankAccount: expect.any(Array),
              }),
              thirdPartyInterest: expect.objectContaining({
                idThirdPartyInterest: expect.any(Number),
                name: expect.any(String),
                transactionType: expect.any(String),
                paymentProvider: expect.any(String),
                amountDollarCents: expect.any(Number),
                percentage: null,
                initialDate: expect.any(Date),
                finalDate: null,
              }),
              platformInterest: expect.objectContaining({
                idPlatformInterest: expect.any(isNumber),
                name: expect.any(String),
                amount: null,
                percentage: expect.any(String),
                points: null,
                initialDate: expect.any(Date),
                finalDate: null,
                description: expect.any(String),
                suscription: null,
              }),
              stateTransactionDescription: expect.any(String),
              platformInterestExtraPoints: null,
              operation: expect.any(Number),
              paymentProviderTransactionId: expect.any(String),
              idTransaction: expect.any(Number),
              initialDate: expect.any(Date),
            }),
          );
        })
        .catch(e => {
          console.log(e);
        });
    });
  });
});
