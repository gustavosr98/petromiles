import { Module, Logger } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import configuration from '@/config/configuration';

import { DatabaseModule } from './../database.module';
import { Seeder } from './seeder';

import { StatesSeederModule } from './state/state.module';
import { RoleSeederModule } from './role/role.module';
import { CountrySeederModule } from './country/country.module';
import { LanguageSeederModule } from './language/language.module';
import { SuscriptionSeederModule } from './suscription/suscription.module';
import { PlatformInterestSeederModule } from './platform_interest/platform_interest.module';
import { ThirdPartyInterestSeederModule } from './third_party_interest/third_party_interest.module';
import { PointsConversionSeederModule } from './points_conversion/points_conversion.module';
import { BankSeederModule } from './bank/bank.module';
import { TaskSeederModule } from './task/task.module';
import { RoutingNumberModule } from './routing-number/routing-number.module';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: !process.env.NODE_ENV
        ? ['.env.development', '.env']
        : ['.env', '.env.development'],
      load: [configuration],
    }),
    StatesSeederModule,
    RoleSeederModule,
    CountrySeederModule,
    LanguageSeederModule,
    SuscriptionSeederModule,
    PlatformInterestSeederModule,
    ThirdPartyInterestSeederModule,
    PointsConversionSeederModule,
    BankSeederModule,
    TaskSeederModule,
    RoutingNumberModule,
  ],
  providers: [Seeder, Logger],
})
export class SeederModule {}
