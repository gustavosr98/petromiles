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

  describe(`GET /transaction/:idTransaction`, () => {
    let idTransaction: number = 1;

    it(`should return the search result`, async () => {
      return await request(app.getHttpServer())
        .get(`/transaction/1`)
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
        });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
