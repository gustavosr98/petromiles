import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';

@Entity()
export class PointsConversion extends BaseEntity {
  @PrimaryGeneratedColumn()
  id_points_conversion: number;

  @Column('decimal', { precision: 8, scale: 3 })
  one_point_equals_dollars: number;

  @Column({ default: () => 'CURRENT_DATE' })
  initial_date: Date;
}
