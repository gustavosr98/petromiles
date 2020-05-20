import { Module } from '@nestjs/common';

import { PaymentProviderService } from './payment-provider.service';

import { StripeModule } from './stripe/stripe.module';

@Module({
  imports: [StripeModule],
  providers: [PaymentProviderService],
  exports: [PaymentProviderService],
})
export class PaymentProviderModule {}
