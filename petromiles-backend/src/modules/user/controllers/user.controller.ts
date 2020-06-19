import {
  Controller,
  Get,
  ClassSerializerInterceptor,
  UseInterceptors,
  Param,
  Inject,
  UseGuards,
  Patch,
  Body,
  Put,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

import { GetUser } from '@/modules/auth/decorators/get-user.decorator';
import { Roles } from '@/modules/auth/decorators/roles.decorator';

// INTERFACES
import { HttpRequest } from '@/logger/http-requests.enum';
import { Role } from '@/enums/role.enum';
import { ApiModules } from '@/logger/api-modules.enum';
import { UpdateDetailsDTO } from '@/modules/user/dto/update-details.dto';
import { UpdatePasswordDTO } from '@/modules/user/dto/update-password.dto';

// SERVICES
import { UserService } from '@/modules/user/services/user.service';
import { UserClientService } from '@/modules/user/services/user-client.service';

// ENTITIES
import { ClientPoints } from '@/entities/user-points.entity';

import { PasswordEncryptorInterceptor } from '@/interceptors/password-encryptor.interceptor';

const baseEndpoint = Object.freeze('user');
@UseGuards(AuthGuard('jwt'))
@UseInterceptors(ClassSerializerInterceptor)
@Controller(baseEndpoint)
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
    return this.userClientService.getPoints(user.email);
  }

  @Roles()
  @UseGuards()
  @Get('client/details')
  async getDetail(@GetUser() user) {
    return await this.userClientService.get(user.email);
  }

  @Patch('language')
  changeUserDefaultLanguage(@GetUser() user, @Body('language') language) {
    this.logger.http(
      `[${ApiModules.USER}] (${HttpRequest.PATCH}) ${user?.email} asks /${baseEndpoint}/language`,
    );
    return this.userClientService.updateDefaultLanguage(user.email, language);
  }

  @UseInterceptors(PasswordEncryptorInterceptor)
  @Put('update-password')
  updatePassword(
    @GetUser() user,
    @Body(ValidationPipe) credentials: UpdatePasswordDTO,
  ) {
    this.logger.http(
      `[${ApiModules.USER}] (${HttpRequest.PUT}) ${user?.email} asks /${baseEndpoint}/update-password`,
    );
    return this.userClientService.updatePassword(user, credentials);
  }

  @Put('update-details')
  updateDetails(
    @GetUser() user,
    @Body(ValidationPipe) details: UpdateDetailsDTO,
  ) {
    this.logger.http(
      `[${ApiModules.USER}] (${HttpRequest.PUT}) ${user?.email} asks /${baseEndpoint}/update-details`,
    );
    return this.userClientService.updateDetails(user, details);
  }
}
