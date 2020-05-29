import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { Repository, getConnection } from 'typeorm';

import { UserDetailsService } from '../user/user-details/user-details.service';
import { StateBankAccountService } from './state-bank-account/state-bank-account.service';

import { BankAccount } from './bank-account/bank-account.entity';
import { UserDetails } from '../user/user-details/user-details.entity';
import { ClientBankAccount } from './client-bank-account/client-bank-account.entity';

import { ApiModules } from '@/logger/api-modules.enum';
import americanRoutingNumbers from '@/constants/americanRoutingNumbers';
import { StateName, StateDescription } from '../management/state/state.enum';
import { PaymentProviderService } from '../payment-provider/payment-provider.service';

@Injectable()
export class BankAccountService {
  constructor(
    @InjectRepository(BankAccount)
    private bankAccountRepository: Repository<BankAccount>,
    private userDetailsService: UserDetailsService,
    private stateBankAccountService: StateBankAccountService,
    private paymentProviderService: PaymentProviderService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async getClientBankAccounts(idUserClient: number): Promise<BankAccount[]> {
    return await getConnection()
      .getRepository(BankAccount)
      .find({
        where: `"userClient"."idUserClient" ='${idUserClient}' and "stateBankAccount"."finalDate" is null and state.name != '${StateName.CANCELLED}'`,
        join: {
          alias: 'bankAccount',
          innerJoinAndSelect: {
            clientBankAccount: 'bankAccount.clientBankAccount',
            stateBankAccount: 'clientBankAccount.stateBankAccount',
            userClient: 'clientBankAccount.userClient',
            state: 'stateBankAccount.state',
          },
        },
      });
  }

  async getBankAccounts(): Promise<BankAccount[]> {
    return await getConnection()
      .getRepository(BankAccount)
      .find();
  }

  async createBankAccount(bankAccountCreateParams): Promise<BankAccount> {
    if (!this.validRoutingNumber(bankAccountCreateParams.routingNumber)) {
      this.logger.error(
        `[${ApiModules.BANK_ACCOUNT}] Invalid Routing Number ${bankAccountCreateParams.routingNumber}`,
      );
      throw new BadRequestException('Bank account already exists');
    }

    //  Verify if the account is of a Petromiles User. If it isn't, create the person in the entity UserDetails
    let userOwner: UserDetails = null;
    if (bankAccountCreateParams.userDetails) {
      userOwner = await this.userDetailsService.createClientDetails(
        bankAccountCreateParams.userDetails,
      );
    }

    const account = new BankAccount();
    account.routingNumber = bankAccountCreateParams.routingNumber;
    account.userDetails = userOwner;
    account.accountNumber = bankAccountCreateParams.accountNumber;
    account.type = bankAccountCreateParams.type;
    account.checkNumber = bankAccountCreateParams.checkNumber;

    const bankAccount = await this.bankAccountRepository.create(account).save();

    this.logger.silly(
      `[${ApiModules.BANK_ACCOUNT}] Bank Account ID: %s was created`,
      bankAccount.idBankAccount,
    );
    return bankAccount;
  }

  validRoutingNumber(routingNumber): boolean {
    return this.isRoutingNumberListed(routingNumber);
  }

  // Only validates American bank routing numbers
  private isRoutingNumberListed(routingNumber: string): boolean {
    let isListed = false;
    americanRoutingNumbers.map(arm => {
      if (arm == routingNumber) isListed = true;
    });
    return isListed;
  }

  async existsBankAccount(accountNumber): Promise<BankAccount> {
    return await this.bankAccountRepository.findOne({ accountNumber });
  }
  async getBankAccount(idBankAccount: number): Promise<BankAccount> {
    return await this.bankAccountRepository.findOne(idBankAccount);
  }

  async getClientBankAccount(
    idUserClient: number,
    idBankAccount: number,
  ): Promise<ClientBankAccount> {
    const bankAccount = await getConnection()
      .getRepository(ClientBankAccount)
      .findOne({
        where: `userClient.idUserClient = ${idUserClient} AND bankAccount.idBankAccount = ${idBankAccount}`,
        join: {
          alias: 'clientBankAccount',
          innerJoin: {
            bankAccount: 'clientBankAccount.bankAccount',
            userClient: 'clientBankAccount.userClient',
          },
        },
      });
    return bankAccount;
  }

  async cancelBankAccount(idUserClient, idBankAccount, email) {
    const clientBankAccount = await this.getClientBankAccount(
      idUserClient,
      idBankAccount,
    );

    await this.stateBankAccountService.updateStateBankAccount(
      StateName.CANCELLED,
      clientBankAccount,
      StateDescription.BANK_ACCOUNT_CANCELLED,
    );
    const customerId = clientBankAccount.userClient.userDetails.customerId;
    await this.paymentProviderService.deleteBankAccount(
      customerId,
      clientBankAccount.chargeId,
      email,
    );
  }
}
