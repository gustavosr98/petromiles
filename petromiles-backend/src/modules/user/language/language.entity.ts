import { UserDetails } from '../user_details/user_details.entity';
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
  id_language: number;

  @Column()
  name: string;

  // @OneToMany(
  //   type => UserDetails,
  //   userDetails => userDetails.id_user_details,
  //   { nullable: true },
  // )
  // userDetails: UserDetails;
}
