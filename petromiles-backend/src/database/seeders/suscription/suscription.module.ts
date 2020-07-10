import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SuscriptionSeederService } from './suscription.service';
import { Suscription } from '../../../entities/suscription.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Suscription])],
  providers: [SuscriptionSeederService],
  exports: [SuscriptionSeederService],
})
export class SuscriptionSeederModule {}
