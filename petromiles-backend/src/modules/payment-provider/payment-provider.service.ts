import { ApiModules } from '@/logger/api-modules.enum';
import { Injectable, Inject } from '@nestjs/common';

import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
// SERVICES
import { StripeService } from '@/modules/payment-provider/stripe/stripe.service';

// INTERFACES
import {
  ChargeCreateParams,
  Charge,
} from '@/modules/transaction/interfaces/charge.interface';
import {
  PayoutCreateParams,
  Payout,
} from '@/modules/transaction/interfaces/payout.interface';
import {
  CustomerCreateParams,
  CustomerUpdateParams,
  Customer,
  DeletedCustomer,
} from '@/modules/transaction/interfaces/customer.interface';

@Injectable()
export class PaymentProviderService {
  constructor(
    private stripeService: StripeService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
  ) {}

  // BANKS
  async createBankAccount(userClient, bankAccountCreateParams) {
    this.logger.verbose(
      `[${ApiModules.PAYMENT_PROVIDER}] {${userClient.email}} createBankAccount()`,
    );

    // Asocitating with Customer to charge from
    let bankAccountToken = await this.stripeService.createBankAccountByToken({
      bank_account: {
        country: 'US',
        currency: 'usd',
        account_holder_name: `${bankAccountCreateParams.userDetails.firstName} ${bankAccountCreateParams.userDetails.lastName}`,
        account_holder_type: 'individual',
        routing_number: bankAccountCreateParams.routingNumber,
        account_number: bankAccountCreateParams.accountNumber,
      },
    });
    this.logger.verbose(
      `[${ApiModules.PAYMENT_PROVIDER}] {${bankAccountCreateParams.email}} Bank account first token created ${bankAccountToken.id}`,
    );

    const bankAccountSource = await this.asociateBankToCustomer(
      userClient.userDetails.customerId,
      bankAccountToken.id,
    );
    this.logger.verbose(
      `[${ApiModules.PAYMENT_PROVIDER}] {${bankAccountCreateParams.email}} Bank account asociated to CUSTOMER {last4: ${bankAccountSource.last4}} `,
    );

    // Asocitating with Account to send money to
    bankAccountToken = await this.stripeService.createBankAccountByToken({
      bank_account: {
        country: 'US',
        currency: 'usd',
        account_holder_name: `${bankAccountCreateParams.userDetails.firstName} ${bankAccountCreateParams.userDetails.lastName}`,
        account_holder_type: 'individual',
        routing_number: bankAccountCreateParams.routingNumber,
        account_number: bankAccountCreateParams.accountNumber,
      },
    });
    this.logger.verbose(
      `[${ApiModules.PAYMENT_PROVIDER}] {${bankAccountCreateParams.email}} Bank account second token created ${bankAccountToken.id}`,
    );

    const asociatedBankAccount = await this.stripeService.asociateBankAccountToAccount(
      userClient.userDetails.accountId,
      bankAccountToken.id,
    );
    this.logger.verbose(
      `[${ApiModules.PAYMENT_PROVIDER}] {${bankAccountCreateParams.email}} Bank account asociated to ACCOUNT {last4: ${bankAccountSource.last4}} `,
    );

    return {
      transferId: asociatedBankAccount.id,
      chargeId: bankAccountSource.id,
    };
  }

  async verifyBankAccount(verificationRequest: {
    customerId: string;
    bankAccountId: string;
    amounts: number[];
  }) {
    const verification = await this.stripeService.verifyBankAccount(
      verificationRequest,
    );
    return verification;
  }

  // CHARGES
  async createCharge(chargeCreateParams: ChargeCreateParams): Promise<Charge> {
    const charge = await this.stripeService.createCharge(chargeCreateParams);
    return charge;
  }

  // PAYOUTS
  async createPayout(payoutCreateParams: PayoutCreateParams): Promise<Payout> {
    const payout = await this.stripeService.createPayout(payoutCreateParams);
    return payout;
  }

  // ACCOUNTS
  async createAccount(user: { email: string; customerId: string }) {
    const account = await this.stripeService.createAccount({
      type: 'custom',
      country: 'US',
      email: user.email,
      requested_capabilities: ['transfers'],
      metadata: {
        customerId: user.customerId,
      },
    });

    this.logger.verbose(
      `[${ApiModules.PAYMENT_PROVIDER}] {${user.email}} createAccount(): ${account.id}`,
    );

    return account;
  }

  async deleteBankAccount(
    customerId: string,
    bankAccountId: string,
    email: string,
  ) {
    await this.stripeService.deleteBankAccount(customerId, bankAccountId);
    this.logger.verbose(
      `[${ApiModules.PAYMENT_PROVIDER}] {${email}} deleteBankAccount(): ${bankAccountId}`,
    );
  }

  // TRANSFERS
  async createTransfer(transferCreateParams) {
    const transfer = await this.stripeService.createAccount(
      transferCreateParams,
    );
    return transfer;
  }

  // CUSTOMER AND BANKS
  private async asociateBankToCustomer(
    customerId: string,
    bankAccountToken: string,
  ): Promise<any> {
    const bankAsociatedToCustomed = await this.stripeService.asociateBankToCustomer(
      customerId,
      bankAccountToken,
    );
    return bankAsociatedToCustomed;
  }

  // CUSTOMER
  async findAllCustomers(): Promise<Array<Customer>> {
    const customers = await this.stripeService.findAllCustomers();
    return customers;
  }

  async findCustomer(id: string): Promise<Customer | DeletedCustomer> {
    const customer = await this.stripeService.findCustomer(id);
    return customer;
  }

  async createCustomer(customerInfo: CustomerCreateParams): Promise<Customer> {
    const customer = await this.stripeService.createCustomer(customerInfo);
    this.logger.verbose(
      `[${ApiModules.PAYMENT_PROVIDER}] {${customerInfo.email}} createCustomer(): ${customer.id}`,
    );
    return customer;
  }

  async updateCustomer(
    id: string,
    customerInfo: CustomerUpdateParams,
  ): Promise<Customer> {
    const customer = await this.stripeService.updateCustomer(id, customerInfo);
    return customer;
  }

  async deleteCustomer(id: string): Promise<DeletedCustomer> {
    const deletedCustomer = await this.stripeService.deleteCustomer(id);
    return deletedCustomer;
  }
}
