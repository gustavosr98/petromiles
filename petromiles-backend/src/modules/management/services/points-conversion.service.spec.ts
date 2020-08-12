import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PointsConversionService } from '@/modules/management/services/points-conversion.service';

import { PointsConversion } from '@/entities/points-conversion.entity';

import { WinstonModule } from 'nest-winston';
import createOptions from '../../../logger/winston/winston-config';

describe('pointsConversionService', () => {
  let pointsConversionService: PointsConversionService;
  let RepositoryMock: jest.Mock;
  let pointsConversionRepository: Repository<PointsConversion>;

  beforeEach(() => {
    RepositoryMock = jest.fn(() => ({
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      query: jest.fn(),
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
        PointsConversionService,
        {
          provide: getRepositoryToken(PointsConversion),
          useClass: RepositoryMock,
        },
      ],
    }).compile();
    pointsConversionService = module.get<PointsConversionService>(
      PointsConversionService,
    );
    pointsConversionRepository = module.get(
      getRepositoryToken(PointsConversion),
    );
  });

  describe('getRecentPointsConversion()', () => {
    let expectedFind;
    let finalDate;
    let result;

    describe('case: success', () => {
      describe('when everything works well', () => {
        beforeEach(async () => {
          expectedFind = {
            idPointsConversion: 1,
            onePointEqualsDollars: '0.00200000000000',
            initialDate: '2020-08-12 00:00:00.000000',
            finalDate: null,
          };
          finalDate = null;
          (pointsConversionRepository.findOne as jest.Mock).mockResolvedValue(
            expectedFind,
          );
          result = await pointsConversionService.getRecentPointsConversion();
        });
        it('should invoke pointsConversionRepository.findOne()', () => {
          expect(pointsConversionRepository.findOne).toHaveBeenCalledTimes(1);
          expect(pointsConversionRepository.findOne).toHaveBeenCalledWith({
            finalDate: null,
          });
        });
        it('should return one pointConversion', () => {
          expect(result).toStrictEqual(expectedFind);
        });
      });
    });
  });

  describe('endLast(idPointsConversion)', () => {
    let expectedFindOne;
    let expectedCurrentPoint;
    let idPointsConversion;
    let result;

    describe('Case: success', () => {
      describe('whe everything works well', () => {
        beforeEach(async () => {
          expectedFindOne = {
            idPointsConversion: 2,
            onePointEqualsDollars: '0.00166666666667',
            initialDate: '2020-08-12T04:00:00.000Z',
            finalDate: null,
          };
          idPointsConversion = 2;
          expectedCurrentPoint = {
            onePointEqualsDollars: 0.005,
            finalDate: null,
            idPointsConversion: 3,
            initialDate: '2020-08-12T04:00:00.000Z',
          };

          (pointsConversionRepository.findOne as jest.Mock).mockResolvedValue(
            expectedFindOne,
          );
          (pointsConversionRepository.save as jest.Mock).mockResolvedValue(
            expectedCurrentPoint,
          );

          result = await pointsConversionService.endLast(idPointsConversion);
        });

        it('should invoke pointsConversionRepository.findOne ', () => {
          expect(pointsConversionRepository.findOne).toHaveBeenCalledTimes(1);
          expect(pointsConversionRepository.findOne).toHaveBeenCalledWith(
            idPointsConversion,
          );
        });
        it('should return endLast', () => {
          expect(result).toStrictEqual(expectedCurrentPoint);
        });
      });
    });
  });
  describe('update()', () => {
    let pointsConversionId;
    let onePointEqualsDollar;
    let expectedEndLast;
    let result;
    describe('case: success', () => {
      describe('when everything works well', () => {
        beforeEach(async () => {
          expectedEndLast = {
            onePointEqualsDollars: 0.005,
            finalDate: null,
            idPointsConversion: 1,
            initialDate: '2020-08-12T04:00:00.000Z',
          };
          pointsConversionId = 1;
          onePointEqualsDollar = 0.005;

          jest
            .spyOn(pointsConversionService, 'endLast')
            .mockResolvedValue(expectedEndLast);

          (pointsConversionRepository.save as jest.Mock).mockResolvedValue(
            expectedEndLast,
          );

          result = await pointsConversionService.update(
            pointsConversionId,
            onePointEqualsDollar,
          );
        });
        it('should return conversion', () => {
          expect(result).toStrictEqual(expectedEndLast);
        });
      });
    });
  });
});
