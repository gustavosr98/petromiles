import { UserDetails } from './user-details.entity';
import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';

@Entity()
export class Language extends BaseEntity {
  @PrimaryGeneratedColumn()
  idLanguage: number;

  @Column()
  name: string;

  @Column()
  shortname: string;

  @OneToMany(
    type => UserDetails,
    userDetails => userDetails.language,
    { nullable: true },
  )
  userDetails: UserDetails[];
}
