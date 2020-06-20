import { Role } from '@/entities/role.entity';
import { Injectable, Logger } from '@nestjs/common';
import { getConnection } from 'typeorm';

import { StateSeederService } from './state/state.service';
import { RolesSeederService } from './role/role.service';
import { CountrySeederService } from './country/country.service';
import { LanguageSeederService } from './language/language.service';
import { SuscriptionSeederService } from './suscription/suscription.service';
import { PlatformInterestSeederService } from './platform_interest/platform_interest.service';
import { ThirdPartyInterestSeederService } from './third_party_interest/third_party_interest.service';
import { PointsConversionSeederService } from './points_conversion/points_conversion.service';
import { BankSeederService } from './bank/bank.service';
import { TaskSeederService } from './task/task.service';

@Injectable()
export class Seeder {
  constructor(
    private readonly logger: Logger,
    private readonly stateSeederService: StateSeederService,
    private readonly roleSeederService: RolesSeederService,
    private readonly countrySeederService: CountrySeederService,
    private readonly languageSeederService: LanguageSeederService,
    private readonly suscriptionSeederService: SuscriptionSeederService,
    private readonly platformInterestSeederService: PlatformInterestSeederService,
    private readonly thirdPartyInterestSeederService: ThirdPartyInterestSeederService,
    private readonly pointsConversionSeederService: PointsConversionSeederService,
    private readonly bankSeederService: BankSeederService,
    private readonly taskSeederService: TaskSeederService,
  ) {}

  async clean() {
    const queryRunner = getConnection().createQueryRunner();
    await queryRunner.clearDatabase();
  }

  async seed() {
    const databaseHasSomething = await getConnection()
      .getRepository(Role)
      .count();

    console.log(databaseHasSomething);

    if (!!databaseHasSomething) {
    } else {
      const rowsInserted = {
        initialRows: await this.seedInitial(),
      };

      this.logger.verbose('Database rows inserted');
      this.logger.verbose(rowsInserted);
    }
  }

  async seedInitial() {
    return {
      ROLES: await this.role(),
      STATE: await this.state(),
      COUNTRY: await this.country(),
      BANK: await this.bank(),
      LANGUAGE: await this.language(),
      SUSCRIPTION: await this.suscription(),
      PLATFORM: await this.platformInterest(),
      THIRD_PARTY_INTEREST: await this.thirdPartyInterest(),
      POINTS_CONVERSION: await this.pointsConversion(),
      TASKS: await this.task(),
    };
  }

  async state(): Promise<number> {
    return await Promise.all(this.stateSeederService.createState())
      .then(createdState => {
        const STATE_ROWS = createdState.filter(
          nullValueOrCreatedLanguage => nullValueOrCreatedLanguage,
        ).length;
        return STATE_ROWS;
      })
      .catch(error => {
        return Promise.reject(error);
      });
  }

  async role(): Promise<number> {
    return await Promise.all(this.roleSeederService.createRole())
      .then(createdRole => {
        const ROLE_ROW = createdRole.filter(
          nullValueOrCreatedLanguage => nullValueOrCreatedLanguage,
        ).length;
        return ROLE_ROW;
      })
      .catch(error => {
        return Promise.reject(error);
      });
  }

  async country(): Promise<number> {
    return await Promise.all(this.countrySeederService.createCountry())
      .then(createdCountry => {
        const COUNTRY_ROW = createdCountry.filter(
          nullValueOrCreatedLanguage => nullValueOrCreatedLanguage,
        ).length;
        return COUNTRY_ROW;
      })
      .catch(error => {
        return Promise.reject(error);
      });
  }

  async language(): Promise<number> {
    return await Promise.all(this.languageSeederService.createLanguage())
      .then(createdCountry => {
        const LANGUAGE_ROWS = createdCountry.filter(
          nullValueOrCreatedLanguage => nullValueOrCreatedLanguage,
        ).length;
        return LANGUAGE_ROWS;
      })
      .catch(error => {
        return Promise.reject(error);
      });
  }

  async suscription(): Promise<number> {
    return await Promise.all(this.suscriptionSeederService.createSuscription())
      .then(createdSuscription => {
        const SUSCRIPTION_ROWS = createdSuscription.filter(
          nullValueOrCreatedLanguage => nullValueOrCreatedLanguage,
        ).length;
        return SUSCRIPTION_ROWS;
      })
      .catch(error => {
        return Promise.reject(error);
      });
  }

  async thirdPartyInterest(): Promise<number> {
    return await Promise.all(
      this.thirdPartyInterestSeederService.createThirdPartyInterest(),
    )
      .then(createdThirdPartyInterest => {
        const THIRD_PARTY_INTEREST_ROWS = createdThirdPartyInterest.filter(
          nullValueOrCreatedLanguage => nullValueOrCreatedLanguage,
        ).length;
        return THIRD_PARTY_INTEREST_ROWS;
      })
      .catch(error => {
        return Promise.reject(error);
      });
  }

  async platformInterest(): Promise<number> {
    return await Promise.all(
      this.platformInterestSeederService.createPlatformInterest(),
    )
      .then(createdPlataformInterest => {
        const PLATFORM_ROWS = createdPlataformInterest.filter(
          nullValueOrCreatedLanguage => nullValueOrCreatedLanguage,
        ).length;
        return PLATFORM_ROWS;
      })
      .catch(error => {
        return Promise.reject(error);
      });
  }

  async pointsConversion(): Promise<number> {
    return await Promise.all(
      this.pointsConversionSeederService.createPointsConversion(),
    )
      .then(createdPointsConversion => {
        const POINTS_CONVERTION_ROWS = createdPointsConversion.filter(
          nullValueOrCreatedLanguage => nullValueOrCreatedLanguage,
        ).length;
        return POINTS_CONVERTION_ROWS;
      })
      .catch(error => {
        return Promise.reject(error);
      });
  }

  async bank(): Promise<number> {
    return await Promise.all(this.bankSeederService.createBank())
      .then(createdBank => {
        const BANK_ROWS = createdBank.filter(
          nullValueOrCreatedLanguage => nullValueOrCreatedLanguage,
        ).length;
        return BANK_ROWS;
      })
      .catch(error => {
        return Promise.reject(error);
      });
  }

  async task(): Promise<number> {
    return await Promise.all(this.taskSeederService.createTask())
      .then(createdTasks => {
        const TASK_ROWS = createdTasks.filter(
          nullValueOrCreatedLanguage => nullValueOrCreatedLanguage,
        ).length;
        return TASK_ROWS;
      })
      .catch(error => {
        return Promise.reject(error);
      });
  }
}
