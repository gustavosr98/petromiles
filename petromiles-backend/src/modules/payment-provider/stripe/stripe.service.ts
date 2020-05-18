import { Injectable, Inject, UseFilters } from '@nestjs/common';
import Stripe from 'stripe';

import { StripeFilter } from '@/modules/payment-provider/stripe/filters/stripe.filter';

@Injectable()
@UseFilters(new StripeFilter())
export class StripeService {
  constructor(@Inject('STRIPE') private stripe: Stripe) {}

  // BANKS
  async createBankAccountByToken(
    bankAccount: Stripe.TokenCreateParams,
  ): Promise<Stripe.Token> {
    const bankAccountToken = await this.stripe.tokens.create(bankAccount);
    return bankAccountToken;
  }

  async createBankAccountBySource(
    bankAccount: Stripe.TokenCreateParams,
  ): Promise<Stripe.Token> {
    const bankAccountSource = await this.stripe.tokens.create(bankAccount);
    return bankAccountSource;
  }

  // CHARGES
  async createCharge(
    chargeCreateParams: Stripe.ChargeCreateParams,
  ): Promise<Stripe.Charge> {
    const charge = await this.stripe.charges.create(chargeCreateParams);
    return charge;
  }

  // PAYOUTS
  async createPayout(
    payoutCreateParams: Stripe.PayoutCreateParams,
  ): Promise<Stripe.Payout> {
    const payout = await this.stripe.payouts.create(payoutCreateParams);
    return payout;
  }

  // CUSTOMER AND BANKS
  async asociateBankToCustomer(
    customerId: string,
    bankBySource,
  ): Promise<Stripe.CustomerSource> {
    const bankAsociatedToCustomed = await this.stripe.customers.createSource(
      customerId,
      { source: bankBySource.id },
    );
    return bankAsociatedToCustomed;
  }

  // CUSTOMER
  async findAllCustomers(): Promise<Array<Stripe.Customer>> {
    const customers: Stripe.ApiList<Stripe.Customer> = await this.stripe.customers.list();
    return customers.data;
  }

  async findCustomer(
    id: string,
  ): Promise<Stripe.Customer | Stripe.DeletedCustomer> {
    const customer = await this.stripe.customers.retrieve(id);
    return customer;
  }

  async createCustomer(
    customerInfo: Stripe.CustomerCreateParams,
  ): Promise<Stripe.Customer> {
    const customer = await this.stripe.customers.create(customerInfo);
    return customer;
  }

  async updateCustomer(
    id: string,
    customerInfo: Stripe.CustomerUpdateParams,
  ): Promise<Stripe.Customer> {
    const customer = await this.stripe.customers.update(id, customerInfo);
    return customer;
  }

  async deleteCustomer(id: string): Promise<Stripe.DeletedCustomer> {
    const deletedCustomer = await this.stripe.customers.del(id);
    return deletedCustomer;
  }
}
