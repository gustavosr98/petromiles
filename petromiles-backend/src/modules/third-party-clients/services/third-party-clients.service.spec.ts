import { Test, TestingModule } from '@nestjs/testing';
import { ThirdPartyClientsService } from './third-party-clients.service';

describe('ThirdPartyClientsService', () => {
  let service: ThirdPartyClientsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ThirdPartyClientsService],
    }).compile();

    service = module.get<ThirdPartyClientsService>(ThirdPartyClientsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
