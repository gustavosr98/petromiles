import {
  Entity,
  BaseEntity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

import { ThirdPartyClient } from '@/entities/third-party-client.entity';
import { UserClient } from '@/entities/user-client.entity';
import { Transaction } from '@/entities/transaction.entity';

import { ValidationCode } from '@/interfaces/third-party-clients/validation-code.interface';

import { ThirdPartyClientsErrorCodes } from '@/enums/third-party-clients-error-codes.enum';

@Entity()
export class ClientOnThirdParty extends BaseEntity {
  @PrimaryGeneratedColumn()
  idClientOnThirdParty: number;

  @Column()
  code: string;

  @Column({
    type: 'timestamp',
    default: () => "timestamp 'now' + interval '1 hour'",
  })
  expirationDate: Date;

  @ManyToOne(
    type => ThirdPartyClient,
    thirdPartyClient => thirdPartyClient.idThirdPartyClient,
    { nullable: false, eager: true },
  )
  @JoinColumn({ name: 'fk_third_party_client' })
  thirdPartyClient: ThirdPartyClient;

  @ManyToOne(
    type => UserClient,
    userClient => userClient.idUserClient,
    { nullable: false, eager: true },
  )
  @JoinColumn({ name: 'fk_user_client' })
  userClient: UserClient;

  @OneToMany(
    type => Transaction,
    transaction => transaction.idTransaction,
    { nullable: true },
  )
  transaction?: Transaction[];

  isCodeValid(code: string): ValidationCode {
    const date = new Date();

    if (this.code !== code)
      return { valid: false, error: ThirdPartyClientsErrorCodes.INVALID_CODE };

    if (this.expirationDate < date)
      return { valid: false, error: ThirdPartyClientsErrorCodes.EXPIRED_CODE };

    return { valid: true };
  }
}
