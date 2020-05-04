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

@Injectable()
export class Seeder {
  constructor(
    private readonly stateSeederService: StateSeederService,
    private readonly roleSeederService: RolesSeederService,
    private readonly countrySeederService: CountrySeederService,
    private readonly languageSeederService: LanguageSeederService,
    private readonly suscriptionSeederService: SuscriptionSeederService,
    private readonly platformInterestSeederService: PlatformInterestSeederService,
    private readonly thirdPartyInterestSeederService: ThirdPartyInterestSeederService,
    private readonly pointsConversionSeederService: PointsConversionSeederService,
    private readonly bankSeederService: BankSeederService,
  ) {}

  async clean() {
    //   const queryRunner = getConnection().createQueryRunner();
  }

  async seed() {
    let ROLES_ROWS = 0;
    let STATE_ROWS = 0;
    let COUNTRY_ROWS = 0;
    let LANGUAGE_ROWS = 0;
    let SUSCRIPTION_ROWS = 0;
    let PLATFORM_ROWS = 0;
    let THIRD_PARTY_INTEREST_ROWS = 0;
    let POINTS_CONVERSION_ROWS = 0;
    let BANK_ROWS = 0;

    await this.role()
      .then(completed => {
        ROLES_ROWS = completed;
        return ROLES_ROWS;
      })
      .catch(error => {
        return Promise.reject(error);
      });

    await this.state()
      .then(completed => {
        STATE_ROWS = completed;
        return STATE_ROWS;
      })
      .catch(error => {
        return Promise.reject(error);
      });

    await this.country()
      .then(completed => {
        COUNTRY_ROWS = completed;
        return COUNTRY_ROWS;
      })
      .catch(error => {
        return Promise.reject(error);
      });

    await this.language()
      .then(completed => {
        LANGUAGE_ROWS = completed;
        return LANGUAGE_ROWS;
      })
      .catch(error => {
        return Promise.reject(error);
      });

    await this.suscription()
      .then(completed => {
        SUSCRIPTION_ROWS = completed;
        return SUSCRIPTION_ROWS;
      })
      .catch(error => {
        return Promise.reject(error);
      });

    await this.platformInterest()
      .then(completed => {
        PLATFORM_ROWS = completed;
        return PLATFORM_ROWS;
      })
      .catch(error => {
        return Promise.reject(error);
      });

    await this.thirdPartyInterest()
      .then(completed => {
        THIRD_PARTY_INTEREST_ROWS = completed;
        return THIRD_PARTY_INTEREST_ROWS;
      })
      .catch(error => {
        return Promise.reject(error);
      });

    await this.pointsConversion()
      .then(completed => {
        POINTS_CONVERSION_ROWS = completed;
        return POINTS_CONVERSION_ROWS;
      })
      .catch(error => {
        return Promise.reject(error);
      });

    await this.bank()
      .then(completed => {
        BANK_ROWS = completed;
        return BANK_ROWS;
      })
      .catch(error => {
        return Promise.reject(error);
      });
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
}
