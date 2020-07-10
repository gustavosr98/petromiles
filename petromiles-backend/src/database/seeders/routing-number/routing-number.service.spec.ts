import { Test, TestingModule } from '@nestjs/testing';
import { RoutingNumberService } from './routing-number.service';

describe('RoutingNumberService', () => {
  let service: RoutingNumberService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoutingNumberService],
    }).compile();

    service = module.get<RoutingNumberService>(RoutingNumberService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
