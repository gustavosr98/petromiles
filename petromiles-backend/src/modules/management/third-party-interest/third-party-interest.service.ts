import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// ENTITIES
import { ThirdPartyInterest } from './third-party-interest.entity';

// INTERFACES
import { PaymentProvider } from '@/modules/payment-provider/payment-provider.enum';
import { TransactionType } from '@/modules/transaction/transaction/transaction.enum';

@Injectable()
export class ThirdPartyInterestService {
  constructor(
    @InjectRepository(ThirdPartyInterest)
    private thirdPartyInterestRepository: Repository<ThirdPartyInterest>,
  ) {}

  async get(
    paymentProvider: PaymentProvider,
    transactionType: TransactionType,
  ) {
    return await this.thirdPartyInterestRepository.findOne({
      paymentProvider,
      transactionType,
      finalDate: null,
    });
  }

  async getThirdPartyInterest(
    paymentProvider: PaymentProvider,
  ): Promise<ThirdPartyInterest> {
    return await this.thirdPartyInterestRepository.findOne({
      paymentProvider,
      finalDate: null,
    });
  }
}
