import {
  Controller,
  Get,
  ClassSerializerInterceptor,
  UseInterceptors,
  Param,
  Inject,
} from '@nestjs/common';

import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

import { HttpRequest } from './../../logger/http-requests.enum';
import { Role } from '../management/role/role.enum';
import { UserService } from './user.service';
import { GetUser } from '../auth/decorators/get-user.decorator';

// Needs endpoint role protection

const baseEndpoint = Object.freeze('user');
@Controller(baseEndpoint)
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly userService: UserService,
  ) {}

  @Get(':role')
  findAll(@Param('role') role: Role, @GetUser() user) {
    this.logger.http(
      `[USER] (${HttpRequest.GET}) ${user?.email} asks /${baseEndpoint}/${role}`,
    );
    return this.userService.findAll(role);
  }
}
