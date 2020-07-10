import { Role } from '@/entities/role.entity';
import { Injectable, Logger } from '@nestjs/common';
import { getConnection } from 'typeorm';

import { StateSeederService } from '@/database/seeders/state/state.service';
import { RolesSeederService } from '@/database/seeders/role/role.service';
import { CountrySeederService } from '@/database/seeders/country/country.service';
import { LanguageSeederService } from '@/database/seeders/language/language.service';
import { SuscriptionSeederService } from '@/database/seeders/suscription/suscription.service';
import { PlatformInterestSeederService } from '@/database/seeders/platform-interest/platform-interest.service';
import { ThirdPartyInterestSeederService } from '@/database/seeders/third_party_interest/third_party_interest.service';
import { PointsConversionSeederService } from '@/database/seeders/points_conversion/points_conversion.service';
import { BankSeederService } from '@/database/seeders/bank/bank.service';
import { TaskSeederService } from '@/database/seeders/task/task.service';
import { RoutingNumberSeederService } from '@/database/seeders/routing-number/routing-number.service';
import { ThirdPartyClientSeederService } from '@/database/seeders/third-party-client/third-party-client.service';
import { UserAdministratorSeederService } from '@/database/seeders/user-administrator/user-administrator.service';
import { StateUserSeederService } from '@/database/seeders/state-user/state-user.service';
import { UserRoleSeederService } from '@/database/seeders/user-role/user-role.service';
import { UserDetailsSeederService } from '@/database/seeders/user-datails/user-details.service';

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
    private readonly routingNumberSeederService: RoutingNumberSeederService,
    private readonly thirdPartyClientSeederService: ThirdPartyClientSeederService,
    private readonly userAdministratorSeederService: UserAdministratorSeederService,
    private readonly stateUserSeederService: StateUserSeederService,
    private readonly userRoleSeederService: UserRoleSeederService,
    private readonly userDetailsSeederService: UserDetailsSeederService,
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
    const ROLES = await this.role();
    const STATE = await this.state();
    const COUNTRY = await this.country();
    const BANK = await this.bank();
    const LANGUAGE = await this.language();
    const SUSCRIPTION = await this.suscription();
    const PLATFORM = await this.platformInterest();
    const THIRD_PARTY_INTEREST = await this.thirdPartyInterest();
    const POINTS_CONVERSION = await this.pointsConversion();
    const TASKS = await this.task();
    const ROUTING_NUMBER = await this.routingNumber();
    const THIRD_PARTY_CLIENT = await this.thirdPartyClient();
    const USER_ADMINISTRATOR = await this.userAdministrator();
    const STATE_USER = await this.stateUser();
    const USER_ROLE = await this.userRole();
    const USER_DETAILS = await this.userDetails();

    return {
      ROLES,
      STATE,
      COUNTRY,
      BANK,
      LANGUAGE,
      SUSCRIPTION,
      PLATFORM,
      THIRD_PARTY_INTEREST,
      POINTS_CONVERSION,
      TASKS,
      ROUTING_NUMBER,
      THIRD_PARTY_CLIENT,
      USER_ADMINISTRATOR,
      STATE_USER,
      USER_ROLE,
      USER_DETAILS,
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

  async routingNumber(): Promise<number> {
    return await Promise.all(
      await this.routingNumberSeederService.createRoutingNumber(),
    )
      .then(createdRoutingNumber => {
        const ROUTING_NUMBER_ROWS = createdRoutingNumber.filter(
          nullValueOrCreatedRoutingNumber => nullValueOrCreatedRoutingNumber,
        ).length;
        return ROUTING_NUMBER_ROWS;
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

  async thirdPartyClient(): Promise<number> {
    return await Promise.all(
      this.thirdPartyClientSeederService.createThirdPartyClient(),
    )
      .then(createdThirdPartyClient => {
        const THIRD_PARTY_CLIENT_ROWS = createdThirdPartyClient.filter(
          nullValueOrCreatedThirdPartyClient =>
            nullValueOrCreatedThirdPartyClient,
        ).length;
        return THIRD_PARTY_CLIENT_ROWS;
      })
      .catch(error => {
        return Promise.reject(error);
      });
  }

  async userAdministrator(): Promise<number> {
    return await Promise.all(
      this.userAdministratorSeederService.createUserAdministrator(),
    )
      .then(createdUserAdministrator => {
        const USER_ADMINISTRATOR_ROWS = createdUserAdministrator.filter(
          nullValueOrCreatedLanguage => nullValueOrCreatedLanguage,
        ).length;
        return USER_ADMINISTRATOR_ROWS;
      })
      .catch(error => {
        return Promise.reject(error);
      });
  }

  async stateUser(): Promise<number> {
    return await Promise.all(this.stateUserSeederService.createStateUser())
      .then(createdStateUser => {
        const STATE_USER_ROWS = createdStateUser.filter(
          nullValueOrCreatedLanguage => nullValueOrCreatedLanguage,
        ).length;
        return STATE_USER_ROWS;
      })
      .catch(error => {
        return Promise.reject(error);
      });
  }

  async userRole(): Promise<number> {
    return await Promise.all(this.userRoleSeederService.createUserRole())
      .then(createdUserRole => {
        const USER_ROLE_ROWS = createdUserRole.filter(
          nullValueOrCreatedLanguage => nullValueOrCreatedLanguage,
        ).length;
        return USER_ROLE_ROWS;
      })
      .catch(error => {
        return Promise.reject(error);
      });
  }

  async userDetails(): Promise<number> {
    return await Promise.all(this.userDetailsSeederService.createUserDetails())
      .then(createdUserDetails => {
        const USER_DETAILS_ROWS = createdUserDetails.filter(
          nullValueOrCreatedLanguage => nullValueOrCreatedLanguage,
        ).length;
        return USER_DETAILS_ROWS;
      })
      .catch(error => {
        return Promise.reject(error);
      });
  }
}
