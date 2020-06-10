import { Module, HttpModule } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { MailsService } from '@/modules/mails/mails.service';
import { SendGridConfig } from '@/modules/mails/sendGrid.config';

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
