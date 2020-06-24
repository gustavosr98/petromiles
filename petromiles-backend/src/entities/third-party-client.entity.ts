import {
  Entity,
  BaseEntity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { ClientOnThirdParty } from '@/entities/client-on-third-party.entity';

@Entity()
export class ThirdPartyClient extends BaseEntity {
  @PrimaryGeneratedColumn()
  idThirdPartyClient: number;

  @Column()
  name: string;

  @Column()
  apiKey: string;

  @Column()
  accumulatePercentage: string;

  @OneToMany(
    type => ClientOnThirdParty,
    clientOnThirdParty => clientOnThirdParty.idClientOnThirdParty,
    { nullable: true },
  )
  clientOnThirdParty?: ClientOnThirdParty[];
}
