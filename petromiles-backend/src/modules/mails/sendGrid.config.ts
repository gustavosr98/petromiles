import { SendGridModule } from '@ntegral/nestjs-sendgrid';
import { ConfigModule, ConfigService } from '@nestjs/config';

export const SendGridConfig = SendGridModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (cfg: ConfigService) => ({
    apiKey: cfg.get<string>('sendgrid.apiKey'),
  }),
});
