import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UseGuards,
  Request,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDTO } from '../user/dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { TransformSignUpInterceptor } from './interceptors/transform-sign-up.interceptor';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseInterceptors(TransformSignUpInterceptor)
  @Post('signup')
  async signUpClient(@Body(ValidationPipe) user: CreateUserDTO) {
    return await this.authService.createUserClient(user);
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req) {
    return req.user;
  }
}
