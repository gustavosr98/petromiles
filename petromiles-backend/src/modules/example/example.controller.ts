import { Controller, Inject, Get, UseGuards, Request } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../../enums/role.enum';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { ExampleService } from './example.service';

// Controller for authenticated users.
@Controller('example')
@UseGuards(AuthGuard('jwt'))
export class ExampleController {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private example: ExampleService,
  ) {}

  @Roles()
  @UseGuards(RolesGuard)
  @Get()
  testLogger(@GetUser() user) {
    this.logger.error(
      '[EXAMPLE] Testing loggers. Please check out loggers folder',
    );
    this.logger.warn(
      '[EXAMPLE] Testing loggers. Please check out loggers folder',
    );
    this.logger.info(
      '[EXAMPLE] Testing loggers. Please check out loggers folder',
    );
    this.logger.http(
      '[EXAMPLE] Testing loggers. Please check out loggers folder',
      's',
    );
    this.logger.verbose(
      '[EXAMPLE] Testing loggers. Please check out loggers folder',
    );
    this.logger.debug(
      '[EXAMPLE] Testing loggers. Please check out loggers folder',
    );
    this.logger.silly(
      '[EXAMPLE] Testing loggers. Please check out loggers folder',
    );
    return user;
  }

  // Router without any  role restrictions
  @Roles()
  @UseGuards(RolesGuard)
  @Get('protected')
  protectedWithoutRole(@GetUser() user) {
    this.logger.debug('The user %s has his verification token.', user.email);
    return user;
  }

  // Router just for clients
  @Roles(Role.CLIENT)
  @UseGuards(RolesGuard)
  @Get('protected/client')
  forClients(@GetUser() user) {
    this.logger.debug('The user %s is a client', user.email);
    return user;
  }
  // Router just for administrators
  @Roles(Role.ADMINISTRATOR)
  @UseGuards(RolesGuard)
  @Get('protected/admin')
  forAdministrators(@GetUser() user) {
    this.logger.debug('The user %s is a administrator', user.email);
    return user;
  }

  @Get('relations')
  testRelations(@GetUser() user) {
    this.example.example();
  }
}
