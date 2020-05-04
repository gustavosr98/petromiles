import { UserSuscription } from '../user_suscription/user_suscription.entity';
import { PlatformInterest } from '../../management/platform_interest/platform_interest.entity';
import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';

@Entity()
export class Suscription extends BaseEntity {
  @PrimaryGeneratedColumn()
  id_suscription: number;

  @Column()
  name: string;

  @Column()
  cost: number;

  @Column({ nullable: true })
  upgraded_amount: number;

  @Column({ nullable: true })
  description: string;

  @OneToMany(
    type => UserSuscription,
    userSuscription => userSuscription.id_user_suscription,
    { nullable: true },
  )
  userSuscription: UserSuscription;

  @OneToMany(
    type => PlatformInterest,
    platformInterest => platformInterest.id_platform_interest,
    { nullable: false },
  )
  platformInterest: PlatformInterest;
}
