import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { State } from './state/state.entity';
import { Role } from './role/role.entity';
import { PlatformInterestService } from './platform-interest/platform-interest.service';
import { PlatformInterest } from './platform-interest/platform-interest.entity';
import { PointsConversionService } from './points-conversion/points-conversion.service';
import { PointsConversion } from './points-conversion/points-conversion.entity';
import { ThirdPartyInterestService } from './third-party-interest/third-party-interest.service';
import { ThirdPartyInterest } from './third-party-interest/third-party-interest.entity';
import { StateService } from './state/state.service';
import { RoleService } from './role/role.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      State,
      Role,
      PlatformInterest,
      PointsConversion,
      ThirdPartyInterest,
    ]),
  ],
  providers: [
    StateService,
    RoleService,
    PlatformInterestService,
    PointsConversionService,
    ThirdPartyInterestService,
  ],
  exports: [
    StateService,
    RoleService,
    TypeOrmModule.forFeature([State]),
    PlatformInterestService,
    PointsConversionService,
    ThirdPartyInterestService,
  ],
})
export class PlatformAdministratorModule {}
