import { Country } from './country.entity';
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
export class Bank extends BaseEntity {
  @PrimaryGeneratedColumn()
  idBank: number;

  @Column()
  name: string;

  @ManyToOne(
    type => Country,
    country => country.idCountry,
    { nullable: true },
  )
  @JoinColumn({ name: 'fk_country' })
  country: Country;
}
