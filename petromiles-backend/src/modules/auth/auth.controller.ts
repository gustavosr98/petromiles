import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UseInterceptors,
} from '@nestjs/common';
import { Inject } from '@nestjs/common';

import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

import { AuthService } from './auth.service';
import { CreateUserDTO } from '../user/dto/create-user.dto';
import { TransformSignUpInterceptor } from './interceptors/transform-sign-up.interceptor';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private authService: AuthService,
  ) {}

  @UseInterceptors(TransformSignUpInterceptor)
  @Post('signup')
  async signUpClient(@Body(ValidationPipe) user: CreateUserDTO) {
    this.logger.http(
      `[AUTH] Client with the email: ${user.email} is starting the sign up process`,
    );
    return await this.authService.createUserClient(user);
  }

  @Post('login')
  async login(@Body() credentials: App.Auth.LoginRequest) {
    this.logger.http(
      `[AUTH] The user with the email: ${credentials.email} is starting the login process`,
    );
    const user = await this.authService.validateUser(credentials);
    this.logger.verbose(`[AUTH] The user ${credentials.email} is logged in`);
    return user;
  }
}
