import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

import { Country } from '@/entities/country.entity';
import { RoutingNumber } from '@/entities/routing-number.entity';

@Entity()
export class Bank extends BaseEntity {
  @PrimaryGeneratedColumn()
  idBank: number;

  @Column()
  name: string;

  @Column()
  photo: string;

  @ManyToOne(
    type => Country,
    country => country.idCountry,
    { nullable: true, eager: true },
  )
  @JoinColumn({ name: 'fk_country' })
  country: Country;

  @OneToMany(
    type => RoutingNumber,
    routingNumber => routingNumber.idRoutingNumber,
    { nullable: true },
  )
  routingNumber: RoutingNumber[];
}
