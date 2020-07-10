import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import {
  Injectable,
  Inject,
  UseFilters,
  BadRequestException,
} from '@nestjs/common';
import Stripe from 'stripe';

import { StripeFilter } from '@/modules/payment-provider/stripe/filters/stripe.filter';
import { StripeBankAccountStatus } from './bank-account-status.enum';
import { StripeErrors} from "@/enums/stripe-errors.enum";

import { ApiSubmodules } from '@/logger/api-modules.enum';

@Injectable()
@UseFilters(new StripeFilter())
export class StripeService {
  constructor(
    @Inject('STRIPE') private stripe: Stripe,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
  ) {}

  private errorHandler(err, res) {
    if(err.raw.param === StripeErrors.AMMOUNT && err.raw.code === undefined) {
      this.logger.error(`[${ApiSubmodules.STRIPE}] ${err.type}`);
      throw new BadRequestException(`error-messages.stripe_charge_exceeds_source_limit`);
    }else if (err.raw.message === StripeErrors.NO_CONNECTION){
      this.logger.error(`[${ApiSubmodules.STRIPE}] ${err.type}`);
      throw new BadRequestException(`error-messages.stripe_no_connection`);
    } else if(err.raw.param === StripeErrors.AMMOUNT && err.raw.code === StripeErrors.INVALID_INTEGER){
      this.logger.error(`[${ApiSubmodules.STRIPE}] ${err.type}`);
      throw new BadRequestException(`error-messages.stripe_${err.raw.code}`);
    }
    else {
      this.logger.error(`[${ApiSubmodules.STRIPE}] ${err.type}`);
      throw new BadRequestException(`error-messages.stripe_${err.raw.code}`);
    }
    return null;
  }

  // BANKS
  async getBankAccount({
    customerId,
    bankAccountId,
  }: {
    customerId: string;
    bankAccountId: string;
  }): Promise<{ id: string; status: StripeBankAccountStatus }> {
    const bankAccount: any = await this.stripe.customers.retrieveSource(
      customerId,
      bankAccountId,
    );
    return {
      id: bankAccount.id,
      status: bankAccount.status,
    };
  }

  async createBankAccountByToken(
    bankAccount: Stripe.TokenCreateParams,
  ): Promise<Stripe.Token> {
    const bankAccountToken = await this.stripe.tokens
      .create(bankAccount)
      .catch(e => this.errorHandler(e, null));
    return bankAccountToken;
  }

  async createBankAccountBySource(
    bankAccount: Stripe.SourceCreateParams,
  ): Promise<Stripe.Source> {
    const bankAccountSource = await this.stripe.sources
      .create(bankAccount)
      .catch(e => this.errorHandler(e, null));
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
    if (process.env.PETROMILES_ENV === 'development') amounts = [32, 45];
    const verification = await this.stripe.customers.verifySource(
      customerId,
      bankAccountId,
      { amounts },
    )
        .catch(e => this.errorHandler(e, null));
    return verification;
  }

  async asociateBankToCustomer(
    customerId: string,
    bankAccountToken: string,
  ): Promise<Stripe.CustomerSource> {
    const bankAsociatedToCustomed = await this.stripe.customers
      .createSource(customerId, { source: bankAccountToken })
      .catch(e => this.errorHandler(e, null));
    return bankAsociatedToCustomed;
  }

  // CHARGES
  async getCharge(chargeId: string): Promise<Stripe.Charge> {
    const charge = await this.stripe.charges.retrieve(chargeId);
    return charge;
  }

  async createCharge(
    chargeCreateParams: Stripe.ChargeCreateParams,
  ): Promise<Stripe.Charge> {
    const charge = await this.stripe.charges
      .create(chargeCreateParams)
      .catch(e => this.errorHandler(e, null));
    return charge;
  }

  // PAYOUTS
  async createPayout(
    payoutCreateParams: Stripe.PayoutCreateParams,
  ): Promise<Stripe.Payout> {
    const payout = await this.stripe.payouts
      .create(payoutCreateParams)
      .catch(e => this.errorHandler(e, null));
    return payout;
  }

  // ACCOUNTS
  async createAccount(
    accountCreateParams: Stripe.AccountCreateParams,
  ): Promise<Stripe.Account> {
    const account = await this.stripe.accounts
      .create(accountCreateParams)
      .catch(e => this.errorHandler(e, null));
    return account;
  }

  async asociateBankAccountToAccount(
    accountId: string,
    bankAccountId: string,
  ): Promise<Stripe.BankAccount | Stripe.Card> {
    const asociatedBankAccount = await this.stripe.accounts
      .createExternalAccount(accountId, { external_account: bankAccountId })
      .catch(e => this.errorHandler(e, null));
    return asociatedBankAccount;
  }

  async updateBankAccountOfAnAccount(
    accountId: string,
    bankAccountId: string,
    accountUpdateParams: Stripe.ExternalAccountUpdateParams,
  ): Promise<Stripe.BankAccount | Stripe.Card> {
    const udatedBankAccount = await this.stripe.accounts
      .updateExternalAccount(accountId, bankAccountId, accountUpdateParams)
      .catch(e => this.errorHandler(e, null));
    return udatedBankAccount;
  }

  async deleteBankAccount(customerId: string, bankAccountId: string) {
    await this.stripe.customers
      .deleteSource(customerId, bankAccountId)
      .catch(e => this.errorHandler(e, null));
  }

  // TRANSFERS
  async createTransfer(
    transferCreateParams: Stripe.TransferCreateParams,
  ): Promise<Stripe.Transfer> {
    const transfer = await this.stripe.transfers
      .create(transferCreateParams)
      .catch(e => this.errorHandler(e, null));
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
    const customer = await this.stripe.customers.create(customerInfo)
        .catch(e => this.errorHandler(e, null));
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
