import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UseInterceptors,
  Inject,
  UseGuards,
  Get,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

import { CreateUserDTO } from '../user/dto/create-user.dto';
import { GetUser } from './decorators/get-user.decorator';
import { Roles } from './decorators/roles.decorator';
import { ApiModules } from '@/logger/api-modules.enum';
import { HttpRequest } from '@/logger/http-requests.enum';

import { PasswordEncryptorInterceptor } from './interceptors/password-encryptor.interceptor';
import { RolesGuard } from './guards/roles.guard';
import { AuthService } from './auth.service';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private authService: AuthService,
  ) {}

  @UseInterceptors(PasswordEncryptorInterceptor)
  @Post('signup')
  async signUpClient(@Body(ValidationPipe) user: CreateUserDTO) {
    this.logger.http(
      `[${ApiModules.AUTH}] {${user.email}} Client is starting the sign up process`,
    );
    return await this.authService.createUserClient(user);
  }

  @Post('login')
  async login(@Body() credentials: App.Auth.LoginRequest) {
    this.logger.http(
      `[${ApiModules.AUTH}] {${credentials.email}} The user is starting the login process`,
    );
    const user = await this.authService.validateUser(credentials);
    this.logger.verbose(
      `[${ApiModules.AUTH}] The user ${credentials.email} has logged in`,
    );
    return user;
  }

  @Roles()
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard('jwt'))
  @Get('checkToken')
  checkToken(@GetUser() user) {
    this.logger.http(
      `[${ApiModules.AUTH}] (${HttpRequest.GET}) ${user?.email} asks for /auth/checkToken`,
    );
    return user;
  }
}
