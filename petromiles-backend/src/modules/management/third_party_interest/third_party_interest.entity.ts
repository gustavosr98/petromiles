import { BaseEntity, Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class ThirdPartyInterest extends BaseEntity {
  @PrimaryGeneratedColumn()
  id_third_party_interest: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  payment_provider: string;

  @Column({ nullable: true })
  amount_dollar_cents: number;

  @Column({ nullable: true })
  percentage: number;

  @Column({ default: () => 'CURRENT_DATE' })
  initial_date: Date;

  @Column({ nullable: true })
  final_date: Date;
}
