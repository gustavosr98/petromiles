import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { Repository, getConnection } from 'typeorm';

// ENTITIES
import { BankAccount } from '@/entities/bank-account.entity';
import { UserDetails } from '@/entities/user-details.entity';

// INTERFACES
import { ApiModules } from '@/logger/api-modules.enum';
import americanRoutingNumbers from '@/constants/americanRoutingNumbers';

// SERVICES
import { UserClientService } from '@/modules/user/services/user-client.service';

@Injectable()
export class BankAccountService {
  constructor(
    @InjectRepository(BankAccount)
    private bankAccountRepository: Repository<BankAccount>,
    private userClientService: UserClientService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async getAll(): Promise<BankAccount[]> {
    return await getConnection()
      .getRepository(BankAccount)
      .find();
  }

  async create(bankAccountCreateParams): Promise<BankAccount> {
    if (!this.validateRoutingNumber(bankAccountCreateParams.routingNumber)) {
      this.logger.error(
        `[${ApiModules.BANK_ACCOUNT}] Invalid Routing Number ${bankAccountCreateParams.routingNumber}`,
      );
      throw new BadRequestException('error-messages.invalidRoutingNumber');
    }

    //  Verify if the account is of a Petromiles User. If it isn't, create the person in the entity UserDetails
    let userOwner: UserDetails = null;
    if (bankAccountCreateParams.userDetails) {
      userOwner = await this.userClientService.createDetails(
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

  validateRoutingNumber(routingNumber): boolean {
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

  async getAllAccounts(){

    const accounts = await this.bankAccountRepository
        .createQueryBuilder('ba')
        .select('ba."routingNumber", ba."accountNumber", ba."idBankAccount",uc.email ')
        .distinct(true)
        .leftJoin('ba.clientBankAccount', 'cba')
        .leftJoin('ba.userDetails', 'ud')
        .leftJoin('cba.userClient','uc')
        .leftJoin('cba.stateBankAccount', 'sba')
        .where('sba."finalDate" IS NULL')
        .getRawMany()

    return accounts
  }

  async accountInfo(accountId: number){
    return await this.bankAccountRepository
        .createQueryBuilder('ba')
        .select('ba."routingNumber", ba."accountNumber",ba.type, ud."firstName", ud."lastName", uc.email, s.name as state, sba."initialDate"')
        .distinct(true)
        .leftJoin('ba.clientBankAccount','cba')
        .leftJoin('ba.userDetails', 'ud')
        .leftJoin('cba.userClient','uc')
        .leftJoin('cba.stateBankAccount', 'sba')
        .leftJoin('sba.state','s')
        .where('ba."idBankAccount" = :id', {id: accountId})
        .andWhere('sba."finalDate" IS NULL')
        .execute()
  }
}
