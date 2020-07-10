import {
  Controller,
  Post,
  UseGuards,
  Body,
  ParseIntPipe,
  Inject,
  Get,
  Param,
  Put,
  UseInterceptors,
  ClassSerializerInterceptor,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { UpdateResult } from 'typeorm';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

import { Roles } from '@/modules/auth/decorators/roles.decorator';
import { GetUser } from '@/modules/auth/decorators/get-user.decorator';
import { RolesGuard } from '@/modules/auth/guards/roles.guard';

// INTERFACES
import { ApiModules } from '@/logger/api-modules.enum';
import { HttpRequest } from '@/logger/http-requests.enum';
import { Suscription as SuscriptionType } from '@/enums/suscription.enum';

// SERVICES
import { SuscriptionService } from '@/modules/suscription/service/suscription.service';
import { Suscription } from '@/entities/suscription.entity';
import { UpdateSubscriptionDTO } from '@/modules/suscription/dto/update-subscription.dto';

const baseEndpoint = 'suscription';
@UseGuards(AuthGuard('jwt'))
@UseInterceptors(ClassSerializerInterceptor)
@Controller(baseEndpoint)
export class SuscriptionController {
  constructor(
    private suscriptionService: SuscriptionService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  @Roles()
  @UseGuards(RolesGuard)
  @Post('upgrade-to-premium')
  async upgradeToPremiumSuscription(
    @GetUser() user,
    @Body('idBankAccount', ParseIntPipe) idBankAccount,
    @Body('costSuscription') costSuscription: number,
  ) {
    this.logger.http(
      `[${ApiModules.SUSCRIPTION}] (${HttpRequest.POST})  ${user?.email} asks /${baseEndpoint}/upgrade-to-premium`,
    );
    await this.suscriptionService.upgradeToPremium(
      user.email,
      idBankAccount,
      costSuscription,
    );
  }

  @Get('actual')
  getActualSuscription(
    @GetUser() user,
    @Query('id') idUserClient?: number,
  ): Promise<Suscription> {
    this.logger.http(
      `[${ApiModules.SUSCRIPTION}] (${HttpRequest.GET}) ${user?.email} asks /${baseEndpoint}/actual`,
    );

    const id = idUserClient ? idUserClient : user.id;
    return this.suscriptionService.getActualSubscription(id);
  }

  @Get('information/:subscription')
  getSubscripcionPercentage(@Param('subscription') subscription: string) {
    this.logger.http(
      `[${ApiModules.SUSCRIPTION}] (${HttpRequest.GET}) asks /${baseEndpoint}/information/${subscription}`,
    );
    return this.suscriptionService.getSubscriptionPercentage(subscription);
  }

  @Get('/cost/:subscription')
  getActualCost(
    @Param('subscription') subscription: SuscriptionType,
  ): Promise<Suscription> {
    this.logger.http(
      `[${ApiModules.SUSCRIPTION}] (${HttpRequest.GET}) ask cost of subscription /${baseEndpoint}/cost`,
    );
    return this.suscriptionService.getActualCost(subscription);
  }
  @Get()
  getAll(@GetUser() user): Promise<Suscription[]> {
    this.logger.http(
      `[${ApiModules.SUSCRIPTION}] (${HttpRequest.GET}) ${user?.email} asks /${baseEndpoint}`,
    );
    return this.suscriptionService.getAll();
  }

  @Put(':id')
  async updateSubscription(
    @Param('id') idSubscription: number,
    @Body() updateSubscriptionDTO: UpdateSubscriptionDTO,
  ): Promise<UpdateResult> {
    return await this.suscriptionService.update(
      updateSubscriptionDTO,
      idSubscription,
    );
  }
}
