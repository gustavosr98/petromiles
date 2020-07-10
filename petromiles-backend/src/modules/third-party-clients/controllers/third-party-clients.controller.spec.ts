import { Test, TestingModule } from '@nestjs/testing';
import { ThirdPartyClientsController } from './third-party-clients.controller';

describe('ThirdPartyClients Controller', () => {
  let controller: ThirdPartyClientsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ThirdPartyClientsController],
    }).compile();

    controller = module.get<ThirdPartyClientsController>(ThirdPartyClientsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
