import {
  Controller,
  Get,
  ClassSerializerInterceptor,
  UseInterceptors,
  Param,
  Inject,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

import { GetUser } from '../auth/decorators/get-user.decorator';

import { HttpRequest } from './../../logger/http-requests.enum';
import { Role } from '../management/role/role.enum';
import { ApiModules } from '@/logger/api-modules.enum';
import { ClientPoints } from './user-client/user-points.entity';

import { UserService } from './user.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserClientService } from './user-client/user-client.service';

// Needs endpoint role protection

const baseEndpoint = Object.freeze('user');
@UseGuards(AuthGuard('jwt'))
@Controller(baseEndpoint)
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthGuard('jwt'))
@Controller('user')
export class UserController {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly userService: UserService,
    private userClientService: UserClientService,
  ) {}

  @Get(':role')
  findAll(@Param('role') role: Role, @GetUser() user) {
    this.logger.http(
      `[USER] (${HttpRequest.GET}) ${user?.email} asks /${baseEndpoint}/${role}`,
    );
    return this.userService.findAll(role);
  }

  @Get('points/conversion')
  getUserPoints(@GetUser() user): Promise<ClientPoints> {
    this.logger.http(
      `[${ApiModules.USER}] (${HttpRequest.GET}) ${user?.email} asks /${baseEndpoint}/points/conversion`,
    );
    return this.userService.getPoints(user.email);
  }

  @Roles()
  @UseGuards()
  @Get('client/details')
  async getDetail(@GetUser() user) {
    return await this.userClientService.getClient(user.email);
  }
}
