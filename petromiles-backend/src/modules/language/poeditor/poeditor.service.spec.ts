import { Test, TestingModule } from '@nestjs/testing';
import { PoeditorService } from './poeditor.service';

describe('PoeditorService', () => {
  let service: PoeditorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PoeditorService],
    }).compile();

    service = module.get<PoeditorService>(PoeditorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
