import { ConfigModule, ConfigService } from '@nestjs/config';
import { SendGridModule } from '@ntegral/nestjs-sendgrid';

export const SendGridConfig = SendGridModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (cfg: ConfigService) => ({
    apiKey: cfg.get<string>('mails.sendgrid.apiKey'),
  }),
});
