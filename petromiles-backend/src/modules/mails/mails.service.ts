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

  async sendEmail(email, subject, template, data) {
    try {
      const msg: App.SendGrid.Mail = {
        to: email,
        from: this.sendGridConfig.emailFrom,
        subject: subject,
        templateId: template,
        dynamic_template_data: data,
      };

      await this.sendGridClient.send(msg);
      this.logger.verbose(
        `[${ApiModules.MAILS}] {${email}} An email with the subject "${subject}" has been sent`,
      );
    } catch (err) {
      this.logger.error(
        `[${ApiModules.MAILS}] {${email}} Problem sending email. Reason: ${err.message}`,
      );
    }
  }
}
