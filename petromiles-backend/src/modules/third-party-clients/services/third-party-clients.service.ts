import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';

// SERVICES
import { PointsConversionService } from '@/modules/management/services/points-conversion.service';
import { PaymentsService } from '@/modules/payments/services/payments.service';

// ENTITIES
import { ThirdPartyClient } from '@/entities/third-party-client.entity';

// INTERFACES
import { AddPointsRequest } from '@/modules/third-party-clients/dto/add-points-request.dto';
import { AddPointsResponse } from '@/interfaces/third-party-clients/add-points-response.interface';
import { AddPointsRequestType } from '@/enums/add-points-request-type.enum';
import { Product } from '@/modules/third-party-clients/dto/product.dto';
import { TransactionType } from '@/enums/transaction.enum';
import { PlatformInterest } from '@/enums/platform-interest.enum';
import { Interest } from '@/modules/payments/interest.interface';

@Injectable()
export class ThirdPartyClientsService {
  constructor(
    @InjectRepository(ThirdPartyClient)
    private thirdPartyClientsRepository: Repository<ThirdPartyClient>,
    private pointsConversionService: PointsConversionService,
    private paymentsService: PaymentsService,
  ) {}

  async get(apiKey: string): Promise<ThirdPartyClient> {
    return await this.thirdPartyClientsRepository.findOne({ apiKey });
  }

  calculateTentativeCommission(interests: Interest[], dollars: number): number {
    let tentativeCommission: number = dollars;
    interests.map(i => {
      tentativeCommission =
        tentativeCommission - (dollars * i.percentage + i.amount / 100);
    });
    return dollars - tentativeCommission;
  }

  async consultPoints(
    addPointsRequest: AddPointsRequest,
  ): Promise<AddPointsResponse> {
    const mostRecentRate = await this.pointsConversionService.getRecentPointsConversion();
    const accumulatePercentage = parseFloat(
      (await this.get(addPointsRequest.apiKey)).accumulatePercentage,
    );
    const interests = await this.paymentsService.getInterests(
      TransactionType.WITHDRAWAL,
      PlatformInterest.WITHDRAWAL,
    );

    let tentativeCommission: number = 0;
    let tentativePoints: number = 0;

    const products: Product[] = addPointsRequest.products.map(product => {
      tentativePoints = Math.trunc(
        ((product.priceTag / 100) * accumulatePercentage) /
          mostRecentRate.onePointEqualsDollars,
      );

      tentativeCommission = Math.trunc(
        this.calculateTentativeCommission(
          interests,
          (product.priceTag / 100) * accumulatePercentage,
        ) * 100,
      );

      return {
        ...product,
        tentativeCommission: tentativeCommission,
        tentativePoints: tentativePoints,
      };
    });

    const response: AddPointsResponse = {
      request: {
        ...addPointsRequest,
        products,
      },
      confirmationTicket: null,
    };

    return response;
  }

  async addPoints(
    addPointsRequest: AddPointsRequest,
  ): Promise<AddPointsResponse> {
    if (addPointsRequest.type === AddPointsRequestType.CONSULT) {
      return await this.consultPoints(addPointsRequest);
    }
  }
}
