import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { ThirdPartyClientsService } from './third-party-clients.service';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';

import { StateTransactionService } from '@/modules/transaction/services/state-transaction.service';
import { UserClientService } from '@/modules/user/services/user-client.service';
import { ThirdPartyInterestService } from '@/modules/management/services/third-party-interest.service';
import { TransactionService } from '@/modules/transaction/services/transaction.service';
import { CsvService } from '@/modules/third-party-clients/services/csv.service';
import { PaymentsService } from '@/modules/payments/services/payments.service';
import { PointsConversionService } from '@/modules/management/services/points-conversion.service';
import { AuthService } from '@/modules/auth/auth.service';
import { MailsService } from '@/modules/mails/mails.service';
import { ClientOnThirdParty } from '@/entities/client-on-third-party.entity';
import { UserClient } from '@/entities/user-client.entity';
import { ThirdPartyClient } from '@/entities/third-party-client.entity';

import { WinstonModule } from 'nest-winston';
import createOptions from '../../../logger/winston/winston-config';

describe('ThirdPartyClientsService', () => {
  let thirdPartyClientsService: ThirdPartyClientsService;
  let RepositoryMock: jest.Mock;
  let thirdPartyClientsRepository: Repository<ThirdPartyClient>;
  let userClientRepository: Repository<UserClient>;
  let clientOnThirdPartyRepository: Repository<ClientOnThirdParty>;
  let MailsServiceMock: jest.Mock<Partial<MailsService>>;
  let mailsService: MailsService;
  let ConfigServiceMock: jest.Mock<Partial<ConfigService>>;
  let configService: ConfigService;
  let AuthServiceMock: jest.Mock<Partial<AuthService>>;
  let authService: AuthService;
  let PointsConversionServiceMock: jest.Mock<Partial<PointsConversionService>>;
  let pointsConversionService: PointsConversionService;
  let PaymentsServiceMock: jest.Mock<Partial<PaymentsService>>;
  let paymentsService: PaymentsService;
  let CsvServiceMock: jest.Mock<Partial<CsvService>>;
  let csvService: CsvService;
  let TransactionServiceMock: jest.Mock<Partial<TransactionService>>;
  let transactionService: TransactionService;
  let ThirdPartyInterestServiceMock: jest.Mock<Partial<
    ThirdPartyInterestService
  >>;
  let thirdPartyInterestService: ThirdPartyInterestService;
  let UserClientServiceMock: jest.Mock<Partial<UserClientService>>;
  let userClientService: UserClientService;
  let StateTransactionServiceMock: jest.Mock<Partial<StateTransactionService>>;
  let stateTransactionService: StateTransactionService;

  beforeEach(() => {
    RepositoryMock = jest.fn(() => ({
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    }));
    MailsServiceMock = jest.fn<Partial<MailsService>, MailsService[]>(() => ({
      sendEmail: jest.fn(),
    }));
    ConfigServiceMock = jest.fn<Partial<ConfigService>, ConfigService[]>(
      () => ({
        get: jest.fn(),
      }),
    );
    AuthServiceMock = jest.fn<Partial<AuthService>, AuthService[]>(() => ({
      createToken: jest.fn(),
    }));
    PointsConversionServiceMock = jest.fn<
      Partial<PointsConversionService>,
      PointsConversionService[]
    >(() => ({
      getRecentPointsConversion: jest.fn(),
    }));
    PaymentsServiceMock = jest.fn<Partial<PaymentsService>, PaymentsService[]>(
      () => ({
        getInterests: jest.fn(),
      }),
    );
    CsvServiceMock = jest.fn<Partial<CsvService>, CsvService[]>(() => ({
      toJSON: jest.fn(),
    }));
    TransactionServiceMock = jest.fn<
      Partial<TransactionService>,
      TransactionService[]
    >(() => ({
      getTransactionInterests: jest.fn(),
      createTransaction: jest.fn(),
      getThirdPartyTransactions: jest.fn(),
    }));
    ThirdPartyInterestServiceMock = jest.fn<
      Partial<ThirdPartyInterestService>,
      ThirdPartyInterestService[]
    >(() => ({
      get: jest.fn(),
    }));
    UserClientServiceMock = jest.fn<
      Partial<UserClientService>,
      UserClientService[]
    >(() => ({
      get: jest.fn(),
    }));
    StateTransactionServiceMock = jest.fn<
      Partial<StateTransactionService>,
      StateTransactionService[]
    >(() => ({
      update: jest.fn(),
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
        ThirdPartyClientsService,
        {
          provide: getRepositoryToken(ThirdPartyClient),
          useClass: RepositoryMock,
        },
        {
          provide: getRepositoryToken(UserClient),
          useClass: RepositoryMock,
        },
        {
          provide: getRepositoryToken(ClientOnThirdParty),
          useClass: RepositoryMock,
        },
        {
          provide: MailsService,
          useClass: MailsServiceMock,
        },
        {
          provide: ConfigService,
          useClass: ConfigServiceMock,
        },
        {
          provide: AuthService,
          useClass: AuthServiceMock,
        },
        {
          provide: PointsConversionService,
          useClass: PointsConversionServiceMock,
        },
        {
          provide: PaymentsService,
          useClass: PaymentsServiceMock,
        },
        {
          provide: CsvService,
          useClass: CsvServiceMock,
        },
        {
          provide: TransactionService,
          useClass: TransactionServiceMock,
        },
        {
          provide: ThirdPartyInterestService,
          useClass: ThirdPartyInterestServiceMock,
        },
        {
          provide: UserClientService,
          useClass: UserClientServiceMock,
        },
        {
          provide: StateTransactionService,
          useClass: StateTransactionServiceMock,
        },
      ],
    }).compile();

    thirdPartyClientsService = module.get<ThirdPartyClientsService>(
      ThirdPartyClientsService,
    );
    thirdPartyClientsRepository = module.get(
      getRepositoryToken(ThirdPartyClient),
    );
    userClientRepository = module.get(getRepositoryToken(UserClient));
    clientOnThirdPartyRepository = module.get(
      getRepositoryToken(ClientOnThirdParty),
    );
    mailsService = module.get<MailsService>(MailsService);
    configService = module.get<ConfigService>(ConfigService);
    authService = module.get<AuthService>(AuthService);
    pointsConversionService = module.get<PointsConversionService>(
      PointsConversionService,
    );
    paymentsService = module.get<PaymentsService>(PaymentsService);
    csvService = module.get<CsvService>(CsvService);
    transactionService = module.get<TransactionService>(TransactionService);
    thirdPartyInterestService = module.get<ThirdPartyInterestService>(
      ThirdPartyInterestService,
    );
    userClientService = module.get<UserClientService>(UserClientService);
    stateTransactionService = module.get<StateTransactionService>(
      StateTransactionService,
    );
  });
});
