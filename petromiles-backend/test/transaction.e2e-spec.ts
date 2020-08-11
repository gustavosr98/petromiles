import { AuthGuard } from '@nestjs/passport';
import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication, HttpStatus, ExecutionContext } from '@nestjs/common';

import { AppModule } from '@/app.module';

describe('Transaction', () => {
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

    baseEndpoint = Object.freeze('/transaction');
    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
    await new Promise(resolve => setTimeout(() => resolve(), 500));
  });

  describe(`GET ${baseEndpoint}/:idTransaction`, () => {
    let idTransaction: number = 1;

    it(`should return the search result`, () => {
      request(app.getHttpServer())
        .get(`${baseEndpoint}/${idTransaction}`)
        .expect(HttpStatus.OK)
        .then(res => {
          expect(res.body).toStrictEqual(
            expect.objectContaining({
              id: idTransaction,
              date: expect.any(String),
              fullDate: expect.any(String),
              type: expect.any(String),
              bankAccount: expect.any(String),
              bankAccountNickname: expect.any(String),
              clientBankAccountEmail: expect.any(String),
              thirdPartyClient: null,
              pointsConversion: expect.any(Number),
              amount: expect.any(Number),
              interest: expect.any(Number),
              total: expect.any(Number),
              state: expect.any(String),
            }),
          );
        })
        .catch();
    });
  });
});
