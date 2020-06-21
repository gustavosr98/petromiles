import {
  Controller,
  Get,
  Put,
  Body,
  Param,
  Post,
  ClassSerializerInterceptor,
  UseInterceptors,
  ValidationPipe, Inject, UseGuards,
} from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import {GetUser} from "@/modules/auth/decorators/get-user.decorator";
import { AuthGuard } from '@nestjs/passport';

// SERVICES
import { ManagementService } from '@/modules/management/services/management.service';
import { PlatformInterestService } from '@/modules/management/services/platform-interest.service';
import { PointsConversionService } from '@/modules/management/services/points-conversion.service';
import { ThirdPartyInterestService } from '@/modules/management/services/third-party-interest.service';

// INTERFACES
import { UpdateSubscriptionDTO } from '@/modules/suscription/dto/update-subscription.dto';
import { CreatePlatformInterestDTO } from '@/modules/management/dto/create-platform-interest.dto';
import { CreateThirdPartyInterestDTO } from '@/modules/management/dto/create-third-party-interest.dto';
import {UpdateUserStateDTO} from "@/modules/management/dto/update-user-state.dto";

// ENTITIES
import { ThirdPartyInterest } from '@/entities/third-party-interest.entity';
import {ApiModules} from "@/logger/api-modules.enum";
import {HttpRequest} from "@/logger/http-requests.enum";
import {StateUser} from "@/entities/state-user.entity";
;

const baseEndpoint = 'management';
@UseGuards(AuthGuard('jwt'))
@Controller(baseEndpoint)
@UseInterceptors(ClassSerializerInterceptor)
export class ManagementController {
  constructor(
    private managementService: ManagementService,
    private platformInterestService: PlatformInterestService,
    private pointsConversionService: PointsConversionService,
    private thirdPartyInterestService: ThirdPartyInterestService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  @Get('languages')
  getLanguages() {
    return this.managementService.getLanguages();
  }

  @Get('countries')
  getCountries() {
    return this.managementService.getCountries();
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

  @Post('platform-interest/:id')
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

  @Post('state/:id')
  updateUserState(@Param('id') userId: number,
                  @Body() updateUserStateDTO: UpdateUserStateDTO,
                  @GetUser() user): Promise<StateUser>{
    this.logger.http(
        `[${ApiModules.MANAGEMENT}] (${HttpRequest.POST}) ${user?.email} changing state /${baseEndpoint}/state/${userId}`,
    );
    return this.managementService.updateUserState(updateUserStateDTO.role, updateUserStateDTO.state, userId, user.id);
  }

}
