import {
  Entity,
  BaseEntity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { ClientOnThirdParty } from '@/entities/client-on-third-party.entity';
import { Transform } from 'class-transformer';

@Entity()
export class ThirdPartyClient extends BaseEntity {
  @PrimaryGeneratedColumn()
  idThirdPartyClient: number;

  @Column()
  name: string;

  @Column()
  apiKey: string;

  @Transform(percentage => Math.round(percentage * 1000000) / 10000)
  @Column()
  accumulatePercentage: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  photo?: string;

  @OneToMany(
    type => ClientOnThirdParty,
    clientOnThirdParty => clientOnThirdParty.idClientOnThirdParty,
    { nullable: true },
  )
  clientOnThirdParty?: ClientOnThirdParty[];
}
