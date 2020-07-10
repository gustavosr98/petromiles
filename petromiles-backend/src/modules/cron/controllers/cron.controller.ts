import {
  Controller,
  Get,
  Inject,
  Put,
  Body,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

import { GetUser } from '@/modules/auth/decorators/get-user.decorator';

//INTERFACES
import { AuthenticatedUser } from '@/interfaces/auth/authenticated-user.interface';
import { UpdateCronDTO } from '@/modules/cron/dto/cron.dto';

import { ApiModules } from '@/logger/api-modules.enum';
import { HttpRequest } from '@/logger/http-requests.enum';
//ENTITIES
import { Task } from '@/entities/task.entity';

// SERVICES
import { CronService } from '@/modules/cron/services/cron.service';

const baseEndpoint = 'cron';
@UseGuards(AuthGuard('jwt'))
@Controller(baseEndpoint)
@UseInterceptors(ClassSerializerInterceptor)
export class CronController {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private cronService: CronService,
  ) {}

  @Get()
  get(@GetUser() user: AuthenticatedUser): Promise<Task[]> {
    this.logger.http(
      `[${ApiModules.CRON}] (${HttpRequest.GET})   {${user.email}} asks  /${baseEndpoint}`,
    );
    return this.cronService.getTasks();
  }

  @Put()
  update(
    @GetUser() user: AuthenticatedUser,
    @Body() updateCron: UpdateCronDTO,
  ) {
    this.logger.http(
      `[${ApiModules.CRON}] (${HttpRequest.PUT})   {${user.email}} asks  /${baseEndpoint}`,
    );

    return this.cronService.updateJob(updateCron.name, updateCron.frequency);
  }
}
