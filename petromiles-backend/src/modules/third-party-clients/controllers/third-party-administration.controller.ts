import {
  Controller,
  ClassSerializerInterceptor,
  UseInterceptors,
  UseGuards,
  Get,
  Put,
  Body,
} from '@nestjs/common';
import { Inject, Param } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UpdateResult } from 'typeorm';

import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

// ENTITIES
import { ThirdPartyClient } from '@/entities/third-party-client.entity';

// SERVICES
import { ThirdPartyClientsService } from '@/modules/third-party-clients/services/third-party-clients.service';
import { ApiModules } from '@/logger/api-modules.enum';
import { HttpRequest } from '@/logger/http-requests.enum';
import { GetUser } from '@/modules/auth/decorators/get-user.decorator';
import { AuthenticatedUser } from '@/interfaces/auth/authenticated-user.interface';

const baseEndpoint = 'third-party-administration';
@UseGuards(AuthGuard('jwt'))
@UseInterceptors(ClassSerializerInterceptor)
@Controller(baseEndpoint)
export class ThirdPartyAdministrationController {
  constructor(
    private thirdPartyClientsService: ThirdPartyClientsService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  @Get()
  async getAll(
    @GetUser() user: AuthenticatedUser,
  ): Promise<ThirdPartyClient[]> {
    this.logger.http(
      `[${ApiModules.THIRD_PARTY_CLIENTS}] (${HttpRequest.POST})  {${user.email} }asks /${baseEndpoint}`,
    );
    return await this.thirdPartyClientsService.getAll();
  }

  @Put(':id')
  async update(
    @Param('id') idThirdPartyClient: number,
    @GetUser() user: AuthenticatedUser,
    @Body('accumulatePercentage') percentage: string,
  ): Promise<UpdateResult> {
    this.logger.http(
      `[${ApiModules.THIRD_PARTY_CLIENTS}] (${HttpRequest.PUT})  {${user.email}} asks /${baseEndpoint}`,
    );
    return await this.thirdPartyClientsService.update(
      idThirdPartyClient,
      percentage,
    );
  }
}
