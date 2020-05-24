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
    bankAccount: Stripe.SourceCreateParams,
  ): Promise<Stripe.Source> {
    const bankAccountSource = await this.stripe.sources.create(bankAccount);
    return bankAccountSource;
  }

  async verifyBankAccount({
    customerId,
    bankAccountId,
    amounts,
  }: {
    customerId: string;
    bankAccountId: string;
    amounts: number[];
  }) {
    const verification = await this.stripe.customers.verifySource(
      customerId,
      bankAccountId,
      { amounts },
    );
    console.log(verification);
    return verification;
  }

  async asociateBankToCustomer(
    customerId: string,
    bankAccountToken: string,
  ): Promise<Stripe.CustomerSource> {
    const bankAsociatedToCustomed = await this.stripe.customers.createSource(
      customerId,
      { source: bankAccountToken },
    );
    return bankAsociatedToCustomed;
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

  // ACCOUNTS
  async createAccount(
    accountCreateParams: Stripe.AccountCreateParams,
  ): Promise<Stripe.Account> {
    const account = await this.stripe.accounts.create(accountCreateParams);
    return account;
  }

  async asociateBankAccountToAccount(
    accountId: string,
    bankAccountId: string,
  ): Promise<Stripe.BankAccount | Stripe.Card> {
    const asociatedBankAccount = await this.stripe.accounts.createExternalAccount(
      accountId,
      { external_account: bankAccountId },
    );
    return asociatedBankAccount;
  }

  // TRANSFERS
  async createTransfer(
    transferCreateParams: Stripe.TransferCreateParams,
  ): Promise<Stripe.Transfer> {
    const transfer = await this.stripe.transfers.create(transferCreateParams);
    return transfer;
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
