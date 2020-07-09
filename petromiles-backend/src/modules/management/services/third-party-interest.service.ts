import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

// ENTITIES
import { ThirdPartyInterest } from '@/entities/third-party-interest.entity';

// INTERFACES
import { PaymentProvider } from '@/enums/payment-provider.enum';
import { TransactionType } from '@/enums/transaction.enum';
import { ApiModules } from '@/logger/api-modules.enum';
import { CreateThirdPartyInterestDTO } from '@/modules/management/dto/create-third-party-interest.dto';

// SERVICES
import { PlatformInterestService } from '@/modules/management/services/platform-interest.service';
import { PlatformInterest } from '@/enums/platform-interest.enum';

@Injectable()
export class ThirdPartyInterestService {
  constructor(
    private platformInterestService: PlatformInterestService,
    @InjectRepository(ThirdPartyInterest)
    private thirdPartyInterestRepository: Repository<ThirdPartyInterest>,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async get(
    paymentProvider: PaymentProvider,
    transactionType: TransactionType,
  ): Promise<ThirdPartyInterest> {
    return await this.thirdPartyInterestRepository.findOne({
      paymentProvider,
      transactionType,
      finalDate: null,
    });
  }

  async getCurrentInterest(
    paymentProvider: PaymentProvider,
    transactionType: TransactionType,
  ): Promise<ThirdPartyInterest> {
    return await this.thirdPartyInterestRepository.findOne({
      paymentProvider,
      transactionType,
      finalDate: null,
    });
  }

  async getAll(): Promise<ThirdPartyInterest[]> {
    return await this.thirdPartyInterestRepository.find({ finalDate: null });
  }

  async update(
    thirdPartyInterestId: number,
    createThirdPartyInterestDTO: CreateThirdPartyInterestDTO,
  ): Promise<ThirdPartyInterest> {
    let { amountDollarCents, transactionType } = createThirdPartyInterestDTO;
    amountDollarCents = Math.round(amountDollarCents * 10000) / 10000;

    createThirdPartyInterestDTO.amountDollarCents = amountDollarCents;

    if (!(await this.verifyAmount(amountDollarCents, transactionType)))
      throw new BadRequestException('error-messages.changeVerificationFirst');

    const lastInterest = await this.endLast(thirdPartyInterestId);
    const thirdPartyInterest = await this.thirdPartyInterestRepository.save(
      createThirdPartyInterestDTO,
    );

    const amount = thirdPartyInterest.amountDollarCents / 100;
    const last = lastInterest.amountDollarCents / 100;
    const log = `Amount = Last: [${last} $]; New: [ ${amount} $]`;
    this.logger.warn(
      `[${ApiModules.MANAGEMENT}] Third party interest: [${thirdPartyInterest.paymentProvider}-${thirdPartyInterest.transactionType}] updated | ${log}`,
    );
    return thirdPartyInterest;
  }

  async endLast(idThirdPartyInterest: number): Promise<ThirdPartyInterest> {
    const currentThirdPartyInterest = await this.thirdPartyInterestRepository.findOne(
      idThirdPartyInterest,
    );
    currentThirdPartyInterest.finalDate = new Date();

    return await this.thirdPartyInterestRepository.save(
      currentThirdPartyInterest,
    );
  }

  async verifyAmount(amount: number, type: TransactionType): Promise<boolean> {
    if (type === TransactionType.DEPOSIT) {
      const verificationInterest = await this.platformInterestService.getInterestByName(
        PlatformInterest.VERIFICATION,
      );
      if (parseFloat(verificationInterest.amount) < amount * 2) return false;
    }

    return true;
  }
}
