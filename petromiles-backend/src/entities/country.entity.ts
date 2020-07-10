import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { Bank } from './bank.entity';
import { UserDetails } from './user-details.entity';

@Entity()
export class Country extends BaseEntity {
  @PrimaryGeneratedColumn()
  idCountry: number;

  @Column({ unique: true })
  name: string;

  @OneToMany(
    type => Bank,
    bank => bank.country,
    { nullable: true },
  )
  bank: Bank[];

  @OneToMany(
    type => UserDetails,
    UserDetails => UserDetails.country,
    { nullable: true },
  )
  UserDetails: UserDetails[];
}
