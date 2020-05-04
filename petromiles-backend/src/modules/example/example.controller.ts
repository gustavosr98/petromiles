import { Controller, Inject, Get } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { ConfigService } from '@nestjs/config';

@Controller('example')
export class ExampleController {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private configService: ConfigService,
  ) {}

  @Get()
  getTest() {
    this.logger.debug(
      'Testing loggers. Please check out loggers folder %s',
      ':)',
    );
  }
}
