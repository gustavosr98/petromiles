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
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

import { GetUser } from '@/modules/auth/decorators/get-user.decorator';
import { Roles } from '@/modules/auth/decorators/roles.decorator';
import { RolesGuard } from '@/modules/auth/guards/roles.guard';

// INTERFACES
import { HttpRequest } from '@/logger/http-requests.enum';
import { Role } from '@/enums/role.enum';
import { ApiModules } from '@/logger/api-modules.enum';
import { UpdateDetailsDTO } from '@/modules/user/dto/update-details.dto';
import { UpdatePasswordDTO } from '@/modules/user/dto/update-password.dto';
import { UserInfo } from '@/interfaces/user/user-info.interface';

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

  @Get('points/conversion')
  getUserPoints(
    @GetUser() user,
    @Query('id') idUserClient?: number,
  ): Promise<ClientPoints> {
    this.logger.http(
      `[${ApiModules.USER}] (${HttpRequest.GET}) ${user?.email} asks /${baseEndpoint}/points/conversion`,
    );

    const id = idUserClient ? idUserClient : user.id;
    return this.userClientService.getPoints(id);
  }

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
    @Query('id') idUserClient?: number,
  ) {
    this.logger.http(
      `[${ApiModules.USER}] (${HttpRequest.PUT}) ${user?.email} asks /${baseEndpoint}/update-details`,
    );
    const id = idUserClient ? idUserClient : user.id;
    return this.userService.updateDetails(id, details);
  }

  @Roles(Role.ADMINISTRATOR)
  @UseGuards(RolesGuard)
  @Get(':role')
  findAll(@Param('role') role: Role, @GetUser() user) {
    this.logger.http(
      `[${ApiModules.USER}] (${HttpRequest.GET}) ${user?.email} asks /${baseEndpoint}/${role}`,
    );
    return this.userService.findAll(role);
  }

  @Roles(Role.ADMINISTRATOR)
  @UseGuards(RolesGuard)
  @Get(':id/:role')
  async findInfo(
    @Param('role') role: Role,
    @Param('id') id: number,
    @GetUser() user,
  ): Promise<UserInfo> {
    this.logger.http(
      `[${ApiModules.USER}] (${HttpRequest.GET}) ${user?.email} asks /${baseEndpoint}/${id}/${role}`,
    );
    return await this.userService.findInfo(id, role);
  }
}