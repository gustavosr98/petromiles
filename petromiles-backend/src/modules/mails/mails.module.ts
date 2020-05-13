import { Module } from '@nestjs/common';
import { MailsService } from './mails.service';
import { SendGridConfig } from './sendGrid.config';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [SendGridConfig],
  providers: [
    MailsService,
    {
      inject: [ConfigService],
      provide: 'SENDGRID_CONFIG',
      useFactory: async (configService: ConfigService) => {
        return {
          emailFrom: configService.get<string>('mails.sendgrid.emailFrom'),
          templates: configService.get<string>('mails.sendgrid.templates'),
        };
      },
    },
  ],
  exports: [MailsService],
})
export class MailsModule {}
