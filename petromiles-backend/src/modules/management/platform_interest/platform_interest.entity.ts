import { Suscription } from '../../suscription/suscription/suscription.entity';
import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

@Entity()
export class PlatformInterest extends BaseEntity {
  @PrimaryGeneratedColumn()
  id_platform_interest: number;

  @Column()
  name: string;

  @Column('decimal', { nullable: true, precision: 8, scale: 2 })
  amount: number;

  @Column('decimal', { nullable: true, precision: 8, scale: 2 })
  percentage: number;

  @Column({ default: () => 'CURRENT_DATE' })
  initial: Date;

  @Column({ nullable: true })
  final_date: Date;

  @ManyToOne(
    type => Suscription,
    suscription => suscription.id_suscription,
    { nullable: true },
  )
  @JoinColumn({ name: 'fk_suscription' })
  suscription = Suscription;
}
