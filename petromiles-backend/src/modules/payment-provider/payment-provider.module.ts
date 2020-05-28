import { Module } from '@nestjs/common';

import { StripeModule } from './stripe/stripe.module';

import { PaymentProviderService } from './payment-provider.service';

@Module({
  imports: [StripeModule],
  providers: [PaymentProviderService],
  exports: [PaymentProviderService],
})
export class PaymentProviderModule {}
