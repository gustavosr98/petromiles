import { Test, TestingModule } from '@nestjs/testing';
import { ThirdPartyAdministrationController } from './third-party-administration.controller';

describe('ThirdPartyAdministrator Controller', () => {
  let controller: ThirdPartyAdministrationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ThirdPartyAdministrationController],
    }).compile();

    controller = module.get<ThirdPartyAdministrationController>(
      ThirdPartyAdministrationController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
