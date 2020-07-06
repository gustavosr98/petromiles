import { ConfigService } from '@nestjs/config';
import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import * as generator from 'generate-password';
import * as bcrypt from 'bcrypt';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

// CONSTANTS
import { MailsSubjets } from '@/constants/mailsSubjectConst';

// INTERFACES
import { Role } from '@/enums/role.enum';
import { Suscription } from '@/enums/suscription.enum';
import { ApiModules } from '@/logger/api-modules.enum';
import { CreateUserDTO } from '@/modules/user/dto/create-user.dto';

// SERVICES
import { UserClientService } from '@/modules/user/services/user-client.service';
import { UserAdministratorService } from '@/modules/user/services/user-administrator.service';
import { MailsService } from '@/modules/mails/mails.service';
import { UserService } from '@/modules/user/services/user.service';
import { SuscriptionService } from '@/modules/suscription/service/suscription.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private userClientService: UserClientService,
    private userAdministratorService: UserAdministratorService,
    private jwtService: JwtService,
    private mailsService: MailsService,
    private configService: ConfigService,
    private userService: UserService,
    private suscriptionService: SuscriptionService,
  ) {}

  async createUserClient(
    user: CreateUserDTO,
    ip: string,
  ): Promise<App.Auth.Response> {
    const createdUser = await this.userClientService.create(user, ip);

    const token = this.createToken(createdUser.user.email, Role.CLIENT);

    await this.suscriptionService.createUserSuscription(
      createdUser.user,
      Suscription.BASIC,
      null,
    );

    this.createWelcomeEmail(
      createdUser.user.email,
      createdUser.userDetails.firstName,
    );

    return {
      email: createdUser.user.email,
      userDetails: createdUser.userDetails,
      role: Role.CLIENT,
      token,
      id: createdUser.user.idUserClient,
      federated: user.password ? false : true,
    };
  }

  async createUserAdministrator(
    user: CreateUserDTO,
  ): Promise<App.Auth.ResponseAdministrator> {
    const passwordAdmin = generator.generate({
      length: 10,
      numbers: true,
    });

    user.salt = await bcrypt.genSalt();

    user.password = await bcrypt.hash(passwordAdmin, user.salt);

    const createdUser = await this.userAdministratorService.create(user);

    this.createWelcomeEmail(
      createdUser.userAdmin.email,
      createdUser.userDetails.firstName,
    );

    return {
      email: createdUser.userAdmin.email,
      password: passwordAdmin,
      userDetails: createdUser.userDetails,
      role: Role.ADMINISTRATOR,
      id: createdUser.userAdmin.idUserAdministrator,
    };
  }

  async validateUser(
    credentials: App.Auth.LoginRequest,
  ): Promise<App.Auth.Response> {
    const { email, password, role } = credentials;
    const info = await this.userService.getActive(credentials);

    if (info) {
      const { user, userDetails } = info;
      const result = {
        email,
        userDetails,
        role,
        id: user.id,
        token: this.createToken(email, role),
        federated: true,
      };

      // If the user didn't sign up with email and password
      if (!info.user.password) {
        return result;
      }

      const passHash = await this.hashPassword(password, user.salt);
      if (user && user.password === passHash) {
        result.federated = false;
        return result;
      } else {
        this.logger.error(
          `[${ApiModules.AUTH}] {${email}} Email or password incorrect`,
        );
        throw new UnauthorizedException('error-messages.loginIncorrect');
      }
    }

    this.logger.error(
      `[${ApiModules.AUTH}] {${email}} The user was not found or user is not active`,
    );
    throw new UnauthorizedException('error-messages.userNotFound');
  }

  createToken(email: string, role: Role) {
    const payload: App.Auth.JWTPayload = { email, role };
    return this.jwtService.sign(payload);
  }

  private async createWelcomeEmail(email, name) {
    const message = {
      to: email,
      subject: MailsSubjets.welcome,
      templateId: this.configService.get('mails.sendgrid.templates.welcome'),
      dynamic_template_data: { user: name },
    };
    await this.mailsService.sendEmail(message);
  }

  async hashPassword(password: string, salt: string): Promise<string> {
    if (!password) {
      this.logger.error(
        `[${ApiModules.AUTH}] The user is a federated user, so needs a password`,
      );
      throw new UnauthorizedException('error-messages.loginIncorrect');
    }

    return bcrypt.hash(password, salt);
  }

  async recoverPassword(credentials: App.Auth.LoginRequest) {
    const { email } = credentials;
    const info = await this.userService.getActive(credentials);

    if (info) {
      const { user, userDetails } = info;

      // If the user didn't sign up with email and password
      if (!info.user.password) {
        this.logger.error(
          `[${ApiModules.AUTH}] {${email}} The user was not created with password`,
        );
        throw new UnauthorizedException('error-messages.userWithoutPassword');
      }

      const password = generator.generate({
        length: 10,
        numbers: true,
      });
      const salt = await bcrypt.genSalt();

      if (credentials.role === Role.ADMINISTRATOR) {
        await this.userAdministratorService.updatePasswordWithoutCurrent(user, {
          password: await bcrypt.hash(password, salt),
          salt: salt,
        });
      } else {
        await this.userClientService.updatePasswordWithoutCurrent(user, {
          password: await bcrypt.hash(password, salt),
          salt: salt,
        });
      }

      const languageMails = userDetails.language.name;
      const template = `recover[${languageMails}]`;
      const subject = MailsSubjets.recover[languageMails];

      const message = {
        to: email,
        subject: subject,
        templateId: this.configService.get(
          `mails.sendgrid.templates.${template}`,
        ),
        dynamic_template_data: { user: userDetails.name, password: password },
      };
      await this.mailsService.sendEmail(message);
    } else {
      this.logger.error(
        `[${ApiModules.AUTH}] {${email}} The user was not found or user is not active`,
      );
      throw new UnauthorizedException('error-messages.userNotFound');
    }
  }
}
