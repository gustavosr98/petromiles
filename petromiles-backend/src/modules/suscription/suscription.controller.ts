import {
  Controller,
  Post,
  UseGuards,
  Body,
  ParseIntPipe,
  Inject,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

import { Roles } from '../auth/decorators/roles.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';

import { RolesGuard } from '../auth/guards/roles.guard';
import { SuscriptionService } from './suscription.service';
import { ApiModules } from 'src/logger/api-modules.enum';
import { HttpRequest } from 'src/logger/http-requests.enum';

const baseEndpoint = 'suscription';
@UseGuards(AuthGuard('jwt'))
@Controller(baseEndpoint)
export class SuscriptionController {
  constructor(
    private suscriptionService: SuscriptionService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  @Roles()
  @UseGuards(RolesGuard)
  @Post('premium')
  async upgradeToPremiumSuscription(
    @GetUser() user,
    @Body('idBankAccount', ParseIntPipe) idBankAccount,
  ) {
    this.logger.http(
      `[${ApiModules.SUSCRIPTION}] (${HttpRequest.POST})  ${user?.email} asks /${baseEndpoint}`,
    );
    await this.suscriptionService.upgradeToPremiumSuscription(
      user.email,
      idBankAccount,
    );
  }
}
