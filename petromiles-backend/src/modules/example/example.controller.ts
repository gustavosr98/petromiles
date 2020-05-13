import { Controller, Inject, Get } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Controller('example')
export class ExampleController {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  @Get()
  testLogger() {
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
  }
}
