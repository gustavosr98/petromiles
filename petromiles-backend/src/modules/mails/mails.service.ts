/* eslint-disable @typescript-eslint/camelcase */

import { Injectable, UseFilters, Inject } from '@nestjs/common';
import { InjectSendGrid, SendGridService } from '@ntegral/nestjs-sendgrid';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailsService {
  public constructor(
    @InjectSendGrid() private readonly sendGridClient: SendGridService,
    @Inject('SENDGRID_CONFIG') private sendGridConfig,
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
      return await this.sendGridClient.send(msg);
    } catch (err) {
      console.log(err.message);
    }
  }
}
