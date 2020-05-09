import { Module } from '@nestjs/common';
import { MailsService } from './mails.service';
import { SendGridConfig } from './sendGrid.config';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [SendGridConfig],
  providers: [
    MailsService,
    {
      provide: 'SENDGRID_CONFIG',
      useFactory: async (configService: ConfigService) => {
        return {
          emailFrom: configService.get<string>('mail.sendgrid.emailFrom'),
          templates: configService.get<string>('mail.sendgrid.templates'),
        };
      },
      inject: [ConfigService],
    },
  ],
  exports: [MailsService],
})
export class MailsModule {}
