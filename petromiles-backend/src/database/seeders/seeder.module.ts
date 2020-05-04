import { Module, Logger } from '@nestjs/common';
import { Seeder } from './seeder';
import { StatesSeederModule } from './state/state.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleSeederModule } from './role/role.module';
import { CountrySeederModule } from './country/country.module';
import { LanguageSeederModule } from './language/language.module';
import { SuscriptionSeederModule } from './suscription/suscription.module';
import { PlatformInterestSeederModule } from './platform_interest/platform_interest.module';
import { ThirdPartyInterestSeederModule } from './third_party_interest/third_party_interest.module';
import { PointsConversionSeederModule } from './points_conversion/points_conversion.module';
import { BankSeederModule } from './bank/bank.module';
import { typeOrmConfig } from './typeorm.config';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    StatesSeederModule,
    RoleSeederModule,
    CountrySeederModule,
    LanguageSeederModule,
    SuscriptionSeederModule,
    PlatformInterestSeederModule,
    ThirdPartyInterestSeederModule,
    PointsConversionSeederModule,
    BankSeederModule,
  ],
  providers: [Seeder, Logger],
})
export class SeederModule {}
