import { PlatformInterest } from './platform-interest.entity';
import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { UserSuscription } from '@/entities/user-suscription.entity';

@Entity()
export class Suscription extends BaseEntity {
  @PrimaryGeneratedColumn()
  idSuscription: number;

  @Column()
  name: string;

  @Column()
  cost: number;

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
