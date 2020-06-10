import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// ENTITIES
import { ThirdPartyInterest } from '@/entities/third-party-interest.entity';

// INTERFACES
import { PaymentProvider } from '@/enums/payment-provider.enum';
import { TransactionType } from '@/enums/transaction.enum';
import { CreateThirdPartyInterestDTO } from '../dto/create-third-party-interest.dto';

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

  async getCurrentInterest(
    paymentProvider: PaymentProvider,
  ): Promise<ThirdPartyInterest> {
    return await this.thirdPartyInterestRepository.findOne({
      paymentProvider,
      finalDate: null,
    });
  }

  async getAll(): Promise<ThirdPartyInterest[]> {
    return await this.thirdPartyInterestRepository.find({ finalDate: null });
  }

  async update(
    thirdPartyInterestId: number,
    createThirdPartyInterestDTO: CreateThirdPartyInterestDTO,
  ) {
    await this.endLast(thirdPartyInterestId);
    return await this.thirdPartyInterestRepository.save(
      createThirdPartyInterestDTO,
    );
  }

  async endLast(idThirdPartyInterest: number) {
    const currentThirdPartyInterest = await this.thirdPartyInterestRepository.findOne(
      idThirdPartyInterest,
    );
    currentThirdPartyInterest.finalDate = new Date();

    await this.thirdPartyInterestRepository.save(currentThirdPartyInterest);
  }
}
