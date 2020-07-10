import {
  Controller,
  Get,
  Put,
  Body,
  Param,
  Post,
  ClassSerializerInterceptor,
  UseInterceptors,
  ValidationPipe,
  Inject,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { UpdateResult } from 'typeorm';

import { GetUser } from '@/modules/auth/decorators/get-user.decorator';

// SERVICES
import { ManagementService } from '@/modules/management/services/management.service';
import { PlatformInterestService } from '@/modules/management/services/platform-interest.service';
import { PointsConversionService } from '@/modules/management/services/points-conversion.service';
import { ThirdPartyInterestService } from '@/modules/management/services/third-party-interest.service';

// INTERFACES
import { UpdateSubscriptionDTO } from '@/modules/suscription/dto/update-subscription.dto';
import { CreatePlatformInterestDTO } from '@/modules/management/dto/create-platform-interest.dto';
import { CreateThirdPartyInterestDTO } from '@/modules/management/dto/create-third-party-interest.dto';
import { UpdateUserStateDTO } from '@/modules/management/dto/update-user-state.dto';
import { AuthenticatedUser } from '@/interfaces/auth/authenticated-user.interface';
import { ApiModules } from '@/logger/api-modules.enum';
import { HttpRequest } from '@/logger/http-requests.enum';
import { PlatformInterestType } from '@/enums/platform-interest-type.enum';

// ENTITIES
import { ThirdPartyInterest } from '@/entities/third-party-interest.entity';
import { StateUser } from '@/entities/state-user.entity';
import { Language } from '@/entities/language.entity';
import { Bank } from '@/entities/bank.entity';
import { Country } from '@/entities/country.entity';
import { PlatformInterest } from '@/entities/platform-interest.entity';
import { PointsConversion } from '@/entities/points-conversion.entity';

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
  getLanguages(@GetUser() user: AuthenticatedUser): Promise<Language[]> {
    this.logger.http(
      `[${ApiModules.MANAGEMENT}] (${HttpRequest.GET})  {${user.email}} asks /${baseEndpoint}/languages`,
    );
    return this.managementService.getLanguages();
  }

  @Get('banks')
  getBanks(@GetUser() user: AuthenticatedUser): Promise<Bank[]> {
    this.logger.http(
      `[${ApiModules.MANAGEMENT}] (${HttpRequest.GET}) {${user.email}} asks  /${baseEndpoint}/banks`,
    );
    return this.managementService.getBanks();
  }

  @Get('countries')
  getCountries(@GetUser() user: AuthenticatedUser): Promise<Country[]> {
    this.logger.http(
      `[${ApiModules.MANAGEMENT}] (${HttpRequest.GET})  {${user.email}} asks /${baseEndpoint}/countries`,
    );
    return this.managementService.getCountries();
  }

  @Get('platform-interest/:type')
  getPlatformInterests(
    @Param('type') type: PlatformInterestType,
    @GetUser() user: AuthenticatedUser,
  ): Promise<PlatformInterest[]> {
    this.logger.http(
      `[${ApiModules.MANAGEMENT}] (${HttpRequest.GET}) {${user.email}} asks  /${baseEndpoint}/platform-interest/${type}`,
    );
    return this.platformInterestService.getInterests(type);
  }

  @Get('third-party-interest')
  getThirdPartyInterests(
    @GetUser() user: AuthenticatedUser,
  ): Promise<ThirdPartyInterest[]> {
    this.logger.http(
      `[${ApiModules.MANAGEMENT}] (${HttpRequest.GET})   {${user.email}} asks  /${baseEndpoint}/third-party-interest`,
    );
    return this.thirdPartyInterestService.getAll();
  }

  @Get('points-details')
  getPointsDetails() {
    return this.managementService.getPointsDetails();
  }

  @Get('statistics')
  getStatistics(@GetUser() user: AuthenticatedUser): Promise<App.Statistics> {
    this.logger.http(
      `[${ApiModules.MANAGEMENT}] (${HttpRequest.GET})   {${user.email}} asks  /${baseEndpoint}/statistics`,
    );
    return this.managementService.getStatistics(user);
  }

  @Put('subscription/:id')
  updateSubscriptionConditions(
    @Param('id') idSubscription: number,
    @Body() updateSubscriptionDTO: UpdateSubscriptionDTO,
    @GetUser() user: AuthenticatedUser,
  ): Promise<UpdateResult> {
    this.logger.http(
      `[${ApiModules.MANAGEMENT}] (${HttpRequest.PUT})  {${user.email}} asks  /${baseEndpoint}/subscription/${idSubscription}`,
    );
    return this.managementService.updateSubscriptionConditions(
      idSubscription,
      updateSubscriptionDTO,
    );
  }

  @Put('platform-interest/:id')
  updatePlatformInterest(
    @Param('id') idPlatformInterest: number,
    @Body(ValidationPipe) createPlatformInterest: CreatePlatformInterestDTO,
    @GetUser() user: AuthenticatedUser,
  ): Promise<PlatformInterest> {
    this.logger.http(
      `[${ApiModules.MANAGEMENT}] (${HttpRequest.PUT})  {${user.email}} asks /${baseEndpoint}/platform-interest/${idPlatformInterest}`,
    );
    return this.platformInterestService.update(
      idPlatformInterest,
      createPlatformInterest,
    );
  }

  @Put('points-conversion/:id')
  updatePointsConversion(
    @Param('id') idPointsConversion: number,
    @Body('onePointEqualsDollars') onePointEqualsDollars: number,
    @GetUser() user: AuthenticatedUser,
  ): Promise<PointsConversion> {
    this.logger.http(
      `[${ApiModules.MANAGEMENT}] (${HttpRequest.PUT})  {${user.email}}  asks /${baseEndpoint}/points-conversion`,
    );
    return this.pointsConversionService.update(
      idPointsConversion,
      onePointEqualsDollars,
    );
  }

  @Put('third-party-interest/:id')
  updateThirdPartyInterest(
    @Param('id') idthirdPartyInterest: number,
    @Body() createThirdPartyInterestDTO: CreateThirdPartyInterestDTO,
    @GetUser() user: AuthenticatedUser,
  ): Promise<ThirdPartyInterest> {
    this.logger.http(
      `[${ApiModules.MANAGEMENT}] (${HttpRequest.PUT}) ${user?.email} updating third-party-interest /${baseEndpoint}/third-party-interest/${idthirdPartyInterest}`,
    );
    return this.thirdPartyInterestService.update(
      idthirdPartyInterest,
      createThirdPartyInterestDTO,
    );
  }

  @Post('state/:id')
  updateUserState(
    @Param('id') userId: number,
    @Body() updateUserStateDTO: UpdateUserStateDTO,
    @GetUser() user,
  ): Promise<StateUser> {
    this.logger.http(
      `[${ApiModules.MANAGEMENT}] (${HttpRequest.PUT}) ${user?.email} changing state /${baseEndpoint}/state/${userId}`,
    );
    return this.managementService.updateUserState(
      updateUserStateDTO.role,
      updateUserStateDTO.state,
      userId,
      user.id,
    );
  }
}
