import { Country } from '../../management/country/country.entity';
import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Bank extends BaseEntity {
  @PrimaryGeneratedColumn()
  id_bank: number;

  @Column()
  name: string;

  @ManyToOne(
    type => Country,
    country => country.id_country,
    { nullable: true },
  )
  @JoinColumn({ name: 'fk_country' })
  country: Country;
}
