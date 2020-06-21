/* eslint-disable @typescript-eslint/camelcase */

import { Injectable, Inject } from '@nestjs/common';
import { InjectSendGrid, SendGridService } from '@ntegral/nestjs-sendgrid';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

import { ApiModules } from '@/logger/api-modules.enum';

@Injectable()
export class MailsService {
  public constructor(
    @InjectSendGrid() private readonly sendGridClient: SendGridService,
    @Inject('SENDGRID_CONFIG') private sendGridConfig,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async sendEmail(msg) {
    if (process.env.SENDGRID_ON === 'true') {
      const from = this.sendGridConfig.emailFrom;
      try {
        await this.sendGridClient.send({ ...msg, from });
        this.logger.verbose(
          `[${ApiModules.MAILS}] {${msg.to}} An email with the subject "${msg.subject}" has been sent`,
        );
      } catch (err) {
        this.logger.error(
          `[${ApiModules.MAILS}] {${msg.to}} Problem sending email. Reason: ${err.message}`,
        );
      }
    } else {
      this.logger.info(
        `[${ApiModules.MAILS}] environment variable SENDGRID_ON is OFF`,
      );
    }
  }
}
