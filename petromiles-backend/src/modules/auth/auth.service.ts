/* eslint-disable @typescript-eslint/camelcase */

import { Injectable } from '@nestjs/common';
import { Role } from 'src/modules/management/role/role.enum';
import { ConfigService } from '@nestjs/config';
import { CreateUserDTO } from '../user/dto/create-user.dto';
import { UserClientService } from '../client/user-client/user-client.service';
import { MailsService } from '../mails/mails.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userClientService: UserClientService,
    private jwtService: JwtService,
    private mailsService: MailsService,
    private configService: ConfigService,
    private userService: UserService,
  ) {}

  async createUserClient(user: CreateUserDTO): Promise<App.Auth.Response> {
    // 1) Crear usuario
    const createdUser = await this.userClientService.createUser(user);
    // 2) Crear token
    const token = this.createJWT(createdUser.user.email);
    // 3) Crear correo de bienvenida
    this.createWelcomeEmail(
      createdUser.user.email,
      createdUser.userDetails.firstName,
    );

    const { language, ...result } = createdUser.userDetails;
    return {
      email: createdUser.user.email,
      userDetails: result,
      role: Role.CLIENT,
      token,
      language: language.name,
    };
  }

  async validateUser(
    email: string,
    pass: string,
  ): Promise<App.Auth.Response | null> {
    const info = await this.userService.getUserByEmail(email);
    if (info) {
      const { user, u_language, u_role, userDetails } = info;
      const result = {
        email: user.email,
        userDetails: userDetails,
        language: u_language,
        role: u_role,
        token: this.createJWT(user.email),
      };
      // Si el usuario no posee contraseña porque proviene de ingreso federado
      if (!info.user.password) {
        return result;
      }
      // Si el usuario posee contraseña verificamos que sea la correcta
      const passHash = await this.hashPassword(pass, user.salt);
      if (user && user.password === passHash) {
        return result;
      } else return null;
    }
    return null;
  }
  private createJWT(email: string) {
    const payload: App.Auth.JWTPayload = { email };
    return this.jwtService.sign(payload);
  }

  private async createWelcomeEmail(email, name) {
    await this.mailsService.sendEmail(
      email,
      'Welcome To PetroMiles',
      this.configService.get('sendgrid.welcomeTemplate'),
      {
        user: name,
      },
    );
  }

  async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}
