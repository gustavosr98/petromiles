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
import { ManagementService } from './management.service';
import { UpdateSubscriptionDTO } from './dto/update-subscription.dto';
import { CreatePlatformInterestDTO } from './dto/create-platform-interest.dto';
import { CreateThirdPartyInterestDTO } from './dto/create-third-party-interest.dto';
import { PlatformInterestService } from './platform-interest/platform-interest.service';
import { ThirdPartyInterest } from './third-party-interest/third-party-interest.entity';

@Controller('management')
@UseInterceptors(ClassSerializerInterceptor)
export class ManagementController {
  constructor(
    private managementService: ManagementService,
    private platformInterestService: PlatformInterestService,
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
    return this.managementService.getThirdPartyInterests();
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
    return this.managementService.updatePlatformInterest(
      idPlatformInterest,
      createPlatformInterest,
    );
  }
  @Put('points-conversion/:id')
  updatePointsConversion(
    @Param('id') idPointsConversion: number,
    @Body('onePointEqualsDollars') onePointEqualsDollars: number,
  ) {
    return this.managementService.updatePointsConversion(
      idPointsConversion,
      onePointEqualsDollars,
    );
  }

  @Put('third-party-interest/:id')
  updateThirdPartyInterest(
    @Param('id') idthirdPartyInterest: number,
    @Body() createThirdPartyInterestDTO: CreateThirdPartyInterestDTO,
  ) {
    return this.managementService.updateThirdPartyInterest(
      idthirdPartyInterest,
      createThirdPartyInterestDTO,
    );
  }
}
