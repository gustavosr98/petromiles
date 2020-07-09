import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// SERVICES
import { PlatformInterestService } from '@/modules/management/services/platform-interest.service';
import { PointsConversionService } from '@/modules/management/services/points-conversion.service';
import { ThirdPartyInterestService } from '@/modules/management/services/third-party-interest.service';
import { ManagementService } from './services/management.service';

// ENTITIES
import { State } from '@/entities/state.entity';
import { Role } from '@/entities/role.entity';
import { PlatformInterest } from '@/entities/platform-interest.entity';
import { Language } from '@/entities/language.entity';
import { ThirdPartyInterest } from '@/entities/third-party-interest.entity';
import { PointsConversion } from '@/entities/points-conversion.entity';
import { StateUser } from '@/entities/state-user.entity';
import { UserClient } from '@/entities/user-client.entity';
import { UserAdministrator } from '@/entities/user-administrator.entity';
import { UserRole } from '@/entities/user-role.entity';
import { Bank } from '@/entities/bank.entity';
import { Country } from '@/entities/country.entity';
import { Transaction } from '@/entities/transaction.entity';

// CONTROLLER
import { ManagementController } from '@/modules/management/controllers/management.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      State,
      Role,
      PlatformInterest,
      PointsConversion,
      ThirdPartyInterest,
      Language,
      Country,
      StateUser,
      UserClient,
      UserAdministrator,
      UserRole,
      Bank,
      Transaction,
    ]),
  ],
  providers: [
    PlatformInterestService,
    PointsConversionService,
    ThirdPartyInterestService,
    ManagementService,
  ],
  exports: [
    TypeOrmModule.forFeature([State]),
    PlatformInterestService,
    PointsConversionService,
    ThirdPartyInterestService,
    ManagementService,
  ],
  controllers: [ManagementController],
})
export class ManagementModule {}
