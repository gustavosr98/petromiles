import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { Bank } from '../../bank-account/bank/bank.entity';
import { UserDetails } from '../../user/user-details/user-details.entity';

@Entity()
export class Country extends BaseEntity {
  @PrimaryGeneratedColumn()
  idCountry: number;

  @Column({ unique: true })
  name: string;

  @OneToMany(
    type => Bank,
    bank => bank.idBank,
    { nullable: true },
  )
  bank: Bank;

  @OneToMany(
    type => UserDetails,
    UserDetails => UserDetails.idUserDetails,
    { nullable: true },
  )
  UserDetails: UserDetails;
}
