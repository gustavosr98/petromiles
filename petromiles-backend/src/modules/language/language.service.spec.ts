import { TestingModule, Test } from '@nestjs/testing';
import { WinstonModule } from 'nest-winston';

import createOptions from '@/logger/winston/winston-config';

// SERVICES
import { LanguageService } from './language.service';
import { PoeditorService } from './poeditor/poeditor.service';

describe('LanguajeService', () => {
  let languajeService: LanguageService;
  let PoeditorServiceMock: jest.Mock<Partial<PoeditorService>>; 
  let poeditorService: PoeditorService;

  beforeEach(() => {
    PoeditorServiceMock = jest.fn<Partial<PoeditorService>, PoeditorService[]>(
      () => ({
        getTerms: jest.fn(),
      })
    );
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        WinstonModule.forRoot(
          createOptions({ fileName: 'petromiles-global.log' }),
        ),
      ],
      providers: [
        LanguageService,
        {
          provide: PoeditorService,
          useClass: PoeditorServiceMock,
        },
      ],
    }).compile();

    languajeService = module.get<LanguageService>(LanguageService);
    poeditorService = module.get<PoeditorService>(PoeditorService);
  });

  describe('getTerms(lang)', () => {
    let language;

    describe('case: success', () => {
      describe('when everything works fine in english language', () => {
        beforeEach(async () => {
          language = 'en';

          (poeditorService.getTerms as jest.Mock).mockImplementation();

          await languajeService.getTerms(language);
        });

        it('should invoke poeditorService.getTerms()', () => {
          expect(poeditorService.getTerms).toHaveBeenCalledTimes(1);
          expect(poeditorService.getTerms).toHaveBeenCalledWith(language);
        });
      });

      describe('when everything works fine in spanish language', () => {
        beforeEach(async () => {
          language = 'es';

          (poeditorService.getTerms as jest.Mock).mockImplementation();

          await languajeService.getTerms(language);
        });

        it('should invoke poeditorService.getTerms()', () => {
          expect(poeditorService.getTerms).toHaveBeenCalledTimes(1);
          expect(poeditorService.getTerms).toHaveBeenCalledWith(language);
        });
      });
    });
  });
});