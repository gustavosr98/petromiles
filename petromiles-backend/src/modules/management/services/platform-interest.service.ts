import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository, Not, IsNull } from 'typeorm';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

// ENTITIES
import { PlatformInterest } from '@/entities/platform-interest.entity';
import { ThirdPartyInterest } from '@/entities/third-party-interest.entity';

// INTERFACES
import { CreatePlatformInterestDTO } from '@/modules/management/dto/create-platform-interest.dto';
import { PlatformInterest as PlatformInterestEnum } from '@/enums/platform-interest.enum';
import { PlatformInterestType } from '@/enums/platform-interest-type.enum';
import { ApiModules } from '@/logger/api-modules.enum';
import { TransactionType } from '@/enums/transaction.enum';
import { PaymentProvider } from '@/enums/payment-provider.enum';

@Injectable()
export class PlatformInterestService {
  constructor(
    @InjectRepository(PlatformInterest)
    private platformInterestRepository: Repository<PlatformInterest>,
    @InjectRepository(ThirdPartyInterest)
    private thirdPartyInterestRepository: Repository<ThirdPartyInterest>,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async getInterestByName(
    name: PlatformInterestEnum,
  ): Promise<PlatformInterest> {
    return await this.platformInterestRepository.findOne({
      name,
      finalDate: null,
    });
  }

  async getInterests(type: PlatformInterestType): Promise<PlatformInterest[]> {
    const subscription =
      type === PlatformInterestType.EXTRA_POINTS ? Not(IsNull()) : IsNull();
    return await this.platformInterestRepository.find({
      where: {
        finalDate: null,
        suscription: subscription,
      },
    });
  }

  async update(
    currentPlatformInterestId: number,
    createPlatformInterest: CreatePlatformInterestDTO,
  ): Promise<PlatformInterest> {
    let { percentage, points } = createPlatformInterest;
    let amount = parseFloat(createPlatformInterest.amount);

    if (!(await this.verifyCorrectAmount(amount, createPlatformInterest.name)))
      throw new BadRequestException('error-messages.invalidVerificationAmount');

    const lastInterest = await this.endLast(currentPlatformInterestId);

    const platformInterest = await this.platformInterestRepository.save({
      ...createPlatformInterest,
      description: lastInterest.description,
    });

    amount = amount / 100;
    percentage = percentage
      ? (Math.round(parseFloat(percentage) * 1000000) / 10000).toString()
      : null;
    lastInterest.amount = (
      Math.round(parseFloat(lastInterest.amount) * 100) / 10000
    ).toString();
    lastInterest.percentage = (
      Math.round(parseFloat(lastInterest.percentage) * 1000000) / 10000
    ).toString();

    let log;
    if (points)
      log = `Points: Last= [${lastInterest.points} ]; New= [${points} ]; Percentage: Last = [${lastInterest.percentage} %]; New  = [${percentage} %]`;
    else if (amount)
      log = `Amount: Last =  [${lastInterest.amount} $]; New = [${amount} $]`;
    else
      log = `Percentage: Last = [${lastInterest.percentage} %]; New = [${percentage} %]`;

    this.logger.warn(
      `[${ApiModules.MANAGEMENT}] Platform interest: [${platformInterest.name}] updated | ${log}`,
    );
    return platformInterest;
  }

  async endLast(idPlatformInterest: number) {
    const currentPlatformInterest = await this.platformInterestRepository.findOne(
      { idPlatformInterest },
    );
    currentPlatformInterest.finalDate = new Date();

    return await this.platformInterestRepository.save(currentPlatformInterest);
  }

  async verifyCorrectAmount(
    amount: number,
    name: PlatformInterestEnum,
  ): Promise<boolean> {
    if (name == PlatformInterestEnum.VERIFICATION) {
      const interest = await this.thirdPartyInterestRepository.findOne({
        where: {
          paymentProvider: PaymentProvider.STRIPE,
          transactionType: TransactionType.DEPOSIT,
          finalDate: null,
        },
      });

      if (interest.amountDollarCents * 2 > amount) return false;
    }

    return true;
  }
}
