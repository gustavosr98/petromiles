import { BaseEntity, Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Country extends BaseEntity {
  @PrimaryGeneratedColumn()
  id_country: number;

  @Column({ unique: true })
  name: string;
}
