import { Injectable } from '@nestjs/common';
import { StripeService } from '@/modules/payment-provider/stripe/stripe.service';
import {
  CreateBankAccountParams,
  BankAccount,
} from '@/modules/transaction/interfaces/bank-account.interface';
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
  constructor(private stripeService: StripeService) {}

  // BANKS
  async createBankAccount(
    bankAccount: CreateBankAccountParams,
  ): Promise<BankAccount> {
    const bankAccountSource: BankAccount = await this.stripeService.createBankAccountBySource(
      bankAccount,
    );
    return bankAccountSource;
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

  // CUSTOMER AND BANKS
  async asociateBankToCustomer(customerId: string, bankBySource) {
    const bankAsociatedToCustomed = await this.stripeService.asociateBankToCustomer(
      customerId,
      { source: bankBySource.id },
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
