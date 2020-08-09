import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { Repository, getConnection } from 'typeorm';

// ENTITIES
import { BankAccount } from '@/entities/bank-account.entity';
import { RoutingNumber } from '@/entities/routing-number.entity';
import { Bank } from '@/entities/bank.entity';
import { UserClient } from '@/entities/user-client.entity';

// INTERFACES
import { ApiModules } from '@/logger/api-modules.enum';
import { CreateBankAccountDTO } from '@/modules/bank-account/dto/create-bank-account.dto';

// SERVICES
import { UserClientService } from '@/modules/user/services/user-client.service';

@Injectable()
export class BankAccountService {
  constructor(
    @InjectRepository(BankAccount)
    private bankAccountRepository: Repository<BankAccount>,
    @InjectRepository(RoutingNumber)
    private routingNumberRepository: Repository<RoutingNumber>,
    private userClientService: UserClientService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async getAll(): Promise<BankAccount[]> {
    return await this.bankAccountRepository.find();
  }

  async create(
    bankAccountCreateParams: CreateBankAccountDTO,
    userClient: UserClient,
  ): Promise<BankAccount> {
    const { routingNumber, ...bankAccount } = bankAccountCreateParams;
    const routingNumberFound = await this.getValidRoutingNumber(
      routingNumber,
      bankAccount.bank,
    );

    //  Verify if the account is of a Petromiles User. If it isn't, create the person in the entity UserDetails
    if (bankAccount.userDetails) {
      bankAccount.userDetails = await this.userClientService.createDetails(
        { ...bankAccount.userDetails, userClient },
        'yes',
      );
    }

    const bankAccountCreated = await this.bankAccountRepository.save({
      routingNumber: routingNumberFound,
      ...bankAccount,
    });

    this.logger.silly(
      `[${ApiModules.BANK_ACCOUNT}] Bank Account ID: %s was created`,
      bankAccountCreated.idBankAccount,
    );
    return bankAccountCreated;
  }

  // Only validates American bank routing numbers
  async getValidRoutingNumber(
    number: string,
    bank: Bank,
  ): Promise<RoutingNumber> {
    const routingNumberFound = await this.routingNumberRepository.findOne({
      number,
      bank,
    });

    if (routingNumberFound === undefined) {
      this.logger.error(
        `[${ApiModules.BANK_ACCOUNT}] Invalid Routing Number ${number}`,
      );
      throw new BadRequestException('error-messages.invalidRoutingNumber');
    }

    return routingNumberFound;
  }

  async accountInfo(accountId: number) {
    return await this.bankAccountRepository
      .createQueryBuilder('ba')
      .select(
        'cba.primary, ba."nickname",ba."accountNumber",ba.type, ud."firstName", ud."lastName", uc.email, s.name as state, sba."initialDate"',
      )
      .addSelect('rn.number, rn.idRoutingNumber')
      .addSelect('b.name as "bankName", b.idBank, b.photo')
      .distinct(true)
      .leftJoin('ba.clientBankAccount', 'cba')
      .leftJoin('ba.routingNumber', 'rn')
      .leftJoin('rn.bank', 'b')
      .leftJoin('ba.userDetails', 'ud')
      .leftJoin('cba.userClient', 'uc')
      .leftJoin('cba.stateBankAccount', 'sba')
      .leftJoin('sba.state', 's')
      .where('ba."idBankAccount" = :id', { id: accountId })
      .andWhere('sba."finalDate" IS NULL')
      .execute();
  }
}
