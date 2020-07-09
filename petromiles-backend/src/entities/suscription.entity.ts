import { PlatformInterest } from './platform-interest.entity';
import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { UserSuscription } from '@/entities/user-suscription.entity';
import { Transform } from 'class-transformer';

@Entity()
export class Suscription extends BaseEntity {
  @PrimaryGeneratedColumn()
  idSuscription: number;

  @Column()
  name: string;

  @Transform(cost => {
    if (cost) return Math.round(cost * 100) / 10000;
    return cost;
  })
  @Column()
  cost: number;

  @Transform(upgradedAmount => {
    if (upgradedAmount) return Math.round(upgradedAmount * 100) / 10000;
    return upgradedAmount;
  })
  @Column({ nullable: true })
  upgradedAmount: number;

  @Column({ nullable: true })
  description: string;

  @OneToMany(
    type => UserSuscription,
    userSuscription => userSuscription.suscription,
    { nullable: true },
  )
  userSuscription: UserSuscription[];

  @OneToMany(
    type => PlatformInterest,
    platformInterest => platformInterest.suscription,
    { nullable: false },
  )
  platformInterest: PlatformInterest[];
}
