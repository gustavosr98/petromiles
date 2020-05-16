import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { Repository } from 'typeorm';

import { BankAccount } from './bank-account/bank-account.entity';
import { UserDetails } from '../user/user-details/user-details.entity';
import { UserDetailsService } from '../user/user-details/user-details.service';

@Injectable()
export class BankAccountService {
  constructor(
    @InjectRepository(BankAccount)
    private bankAccountRepository: Repository<BankAccount>,
    private userDetailsService: UserDetailsService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async createBankAccount(options): Promise<BankAccount> {
    if (!this.validate(options.routingNumber))
      throw new BadRequestException('Invalid Routing Number');

    //  Verify if the account is of a Petromiles User. If it isn't, create the person in the entity UserDetails
    let userOwner: UserDetails = null;
    if (options.userDetails) {
      userOwner = await this.userDetailsService.createClientDetails(
        options.userDetails,
      );
    }

    const account = new BankAccount();
    account.routingNumber = options.routingNumber;
    account.userDetails = userOwner;
    account.accountNumber = options.accountNumber;
    account.type = options.type;
    account.checkNumber = options.checkNumber;

    const bankAccount = await this.bankAccountRepository.create(account).save();

    this.logger.silly(
      '[BANK_ACCOUNT] Bank Account ID: %s is created',
      bankAccount.idBankAccount,
    );
    return bankAccount;
  }

  // Valitation for american bank accounts
  validate(routingNumber) {
    const digits = routingNumber.toString();
    let n = 0;
    for (let i = 0; i < digits.length; i += 3) {
      n +=
        parseInt(digits.charAt(i), 10) * 3 +
        parseInt(digits.charAt(i + 1), 10) * 7 +
        parseInt(digits.charAt(i + 2), 10);
    }

    if (n != 0 && n % 10 == 0) return true;
    else return false;
  }
}
