import { ConfigService } from '@nestjs/config';
import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

import { Role } from 'src/modules/management/role/role.enum';
import { CreateUserDTO } from '../user/dto/create-user.dto';
import { UserClientService } from '../user/user-client/user-client.service';
import { MailsService } from '../mails/mails.service';
import { UserService } from '../user/user.service';
import { MailsSubject } from '../mails/mails.enum';

@Injectable()
export class AuthService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private userClientService: UserClientService,
    private jwtService: JwtService,
    private mailsService: MailsService,
    private configService: ConfigService,
    private userService: UserService,
  ) {}

  async createUserClient(user: CreateUserDTO): Promise<App.Auth.Response> {
    const createdUser = await this.userClientService.createUser(user);

    const token = this.createToken(createdUser.user.email, Role.CLIENT);

    this.createWelcomeEmail(
      createdUser.user.email,
      createdUser.userDetails.firstName,
    );

    return {
      email: createdUser.user.email,
      userDetails: createdUser.userDetails,
      role: Role.CLIENT,
      token,
    };
  }

  async validateUser(
    credentials: App.Auth.LoginRequest,
  ): Promise<App.Auth.Response> {
    const { email, password, role } = credentials;
    const info = await this.userService.getUserByEmail(credentials);

    if (info) {
      const { user, userDetails } = info;
      const result = {
        email,
        userDetails,
        role,
        token: this.createToken(email, role),
      };

      // If the user didn't sign up with email and password
      if (!info.user.password) {
        return result;
      }

      const passHash = await this.hashPassword(password, user.salt);
      if (user && user.password === passHash) {
        return result;
      } else {
        this.logger.error(`[AUTH] Email or password incorrect`);
        throw new UnauthorizedException('Email or password incorrect');
      }
    }

    this.logger.error(
      `[AUTH] The user ${email} was not found or user is not active`,
    );
    throw new UnauthorizedException(
      'The user was not found or user is not active',
    );
  }

  private createToken(email: string, role: Role) {
    const payload: App.Auth.JWTPayload = { email, role };
    return this.jwtService.sign(payload);
  }

  private async createWelcomeEmail(email, name) {
    await this.mailsService.sendEmail(
      email,
      MailsSubject.WELCOME,
      this.configService.get('mails.sendgrid.templates.welcome'),
      {
        user: name,
      },
    );
  }

  async hashPassword(password: string, salt: string): Promise<string> {
    if (!password) {
      this.logger.error(
        `[AUTH] The user is a federated user, so needs a password`,
      );
      throw new UnauthorizedException('Email or password incorrect');
    }

    return bcrypt.hash(password, salt);
  }
}
