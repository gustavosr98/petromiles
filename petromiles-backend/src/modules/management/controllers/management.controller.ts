import {
  Controller,
  Get,
  Put,
  Body,
  Param,
  ClassSerializerInterceptor,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';

// SERVICES
import { ManagementService } from '@/modules/management/services/management.service';
import { PlatformInterestService } from '@/modules/management/services/platform-interest.service';
import { SuscriptionService } from '@/modules/suscription/service/suscription.service';
import { PointsConversionService } from '@/modules/management/services/points-conversion.service';
import { ThirdPartyInterestService } from '@/modules/management/services/third-party-interest.service';

// INTERFACES
import { UpdateSubscriptionDTO } from '@/modules/suscription/dto/update-subscription.dto';
import { CreatePlatformInterestDTO } from '@/modules/management/dto/create-platform-interest.dto';
import { CreateThirdPartyInterestDTO } from '@/modules/management/dto/create-third-party-interest.dto';

// ENTITIES
import { ThirdPartyInterest } from '@/entities/third-party-interest.entity';

@Controller('management')
@UseInterceptors(ClassSerializerInterceptor)
export class ManagementController {
  constructor(
    private managementService: ManagementService,
    private platformInterestService: PlatformInterestService,
    private pointsConversionService: PointsConversionService,
    private thirdPartyInterestService: ThirdPartyInterestService,
  ) {}

  @Get('languages')
  getLanguages() {
    return this.managementService.getLanguages();
  }

  @Get('platform-interest')
  getPlatformInterests() {
    return this.platformInterestService.getInterests();
  }

  @Get('third-party-interest')
  getThirdPartyInterests(): Promise<ThirdPartyInterest[]> {
    return this.thirdPartyInterestService.getAll();
  }

  @Put('subscription/:id')
  updateSubscriptionConditions(
    @Param('id') idSubscription: number,
    @Body() updateSubscriptionDTO: UpdateSubscriptionDTO,
  ) {
    return this.managementService.updateSubscriptionConditions(
      idSubscription,
      updateSubscriptionDTO,
    );
  }

  @Put('platform-interest/:id')
  updatePlatformInterest(
    @Param('id') idPlatformInterest: number,
    @Body(ValidationPipe) createPlatformInterest: CreatePlatformInterestDTO,
  ) {
    return this.platformInterestService.update(
      idPlatformInterest,
      createPlatformInterest,
    );
  }

  @Put('points-conversion/:id')
  updatePointsConversion(
    @Param('id') idPointsConversion: number,
    @Body('onePointEqualsDollars') onePointEqualsDollars: number,
  ) {
    return this.pointsConversionService.update(
      idPointsConversion,
      onePointEqualsDollars,
    );
  }

  @Put('third-party-interest/:id')
  updateThirdPartyInterest(
    @Param('id') idthirdPartyInterest: number,
    @Body() createThirdPartyInterestDTO: CreateThirdPartyInterestDTO,
  ) {
    return this.thirdPartyInterestService.update(
      idthirdPartyInterest,
      createThirdPartyInterestDTO,
    );
  }
}
