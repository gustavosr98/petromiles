import { Country } from '../../management/country/country.entity';
import { RoutingNumber } from '../routing-number/routing-number.entity';
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

  @OneToMany(
    type => RoutingNumber,
    routingNumber => routingNumber.idRoutingNumber,
    { nullable: true },
  )
  routingNumber: RoutingNumber;
}
