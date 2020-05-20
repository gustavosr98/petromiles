import { Module } from '@nestjs/common';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { StripeService } from './stripe.service';
import Stripe from 'stripe';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'STRIPE',
      useFactory: async (configService: ConfigService) => {
        return new Stripe(
          configService.get<string>('paymentProvider.stripe.secretKey'),
          configService.get<Stripe.StripeConfig>(
            'paymentProvider.stripe.config',
          ),
        );
      },
      inject: [ConfigService],
    },
    StripeService,
  ],
  exports: [StripeService],
})
export class StripeModule {}
