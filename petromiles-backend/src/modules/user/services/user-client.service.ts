import { ApiModules } from '@/logger/api-modules.enum';
import {
  Injectable,
  Inject,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository, getConnection, UpdateResult } from 'typeorm';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

// INTERFACES
import { StateName } from '@/enums/state.enum';
import { Language as LanguageEnum } from '@/enums/language.enum';
import { Role } from '@/enums/role.enum';
import { UpdatePasswordDTO } from '@/modules/user/dto/update-password.dto';
import { CreateUserDTO } from '@/modules/user/dto/create-user.dto';
import { UserInfo } from '@/interfaces/user/user-info.interface';

// SERVICES
import { PaymentProviderService } from '@/modules/payment-provider/payment-provider.service';
import { ManagementService } from '@/modules/management/services/management.service';

//  ENTITIES
import { UserClient } from '@/entities/user-client.entity';
import { UserRole } from '@/entities/user-role.entity';
import { StateUser } from '@/entities/state-user.entity';
import { ClientPoints } from '@/entities/user-points.entity';
import { UserDetails } from '@/entities/user-details.entity';
import { Language } from '@/entities/language.entity';

@Injectable()
export class UserClientService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    @InjectRepository(UserClient)
    private userClientRepository: Repository<UserClient>,
    @InjectRepository(UserDetails)
    private userDetailsRepository: Repository<UserDetails>,
    private paymentProviderService: PaymentProviderService,
    private managementService: ManagementService,
  ) {}

  async findAll(): Promise<UserClient[]> {
    return await this.userClientRepository.find();
  }

  async create(
    createUserDTO: CreateUserDTO,
    ip: string,
  ): Promise<App.Auth.UserClient> {
    const {
      firstName,
      lastName,
      middleName,
      secondLastName,
      birthdate,
      address,
      phone,
      photo,
      ...user
    } = createUserDTO;

    if (await this.get({ email: user.email })) {
      this.logger.error(
        `[${ApiModules.USER}] {${user.email}} Email already in use`,
      );
      throw new BadRequestException('Email already in use');
    }

    const paymentProviderCustomer = await this.paymentProviderService.createCustomer(
      {
        email: user.email,
        name: `${firstName} ${lastName}`,
      },
    );
    const paymentProviderAccount = await this.paymentProviderService.createAccount(
      {
        email: user.email,
        name: firstName,
        lastName,
        customerId: paymentProviderCustomer.id,
        ip,
      },
    );

    const userClient = await this.userClientRepository.save(user);

    const userClientDetails = await this.completeRegistration(userClient, {
      firstName,
      lastName,
      middleName,
      secondLastName,
      birthdate,
      address,
      phone,
      photo,
      language: await this.managementService.getLanguage(LanguageEnum.ENGLISH),
      userClient,
      customerId: paymentProviderCustomer.id,
      accountId: paymentProviderAccount.id,
    });

    this.logger.silly(
      `[${ApiModules.USER}] Client with ID: ${userClient.idUserClient} was successfully registered`,
    );
    return userClientDetails;
  }

  async createRole(user: UserClient): Promise<UserRole> {
    const role = await this.managementService.getRoleByName(Role.CLIENT);

    const userRole = new UserRole();
    userRole.role = role;
    userRole.userClient = user;

    return await getConnection()
      .getRepository(UserRole)
      .save(userRole);
  }

  async createState(
    user: UserClient,
    stateName: StateName,
    description: string,
  ): Promise<StateUser> {
    const userState = new StateUser();
    userState.userClient = user;
    userState.initialDate = new Date();
    userState.description = description;
    userState.state = await this.managementService.getState(stateName);
    return await getConnection()
      .getRepository(StateUser)
      .save(userState);
  }

  async createDetails(userClientDetails): Promise<UserDetails> {
    const result = await this.userDetailsRepository.save(userClientDetails);
    result.userClient = null;
    return result;
  }

  private async completeRegistration(
    userClient: UserClient,
    details,
  ): Promise<App.Auth.UserClient> {
    const userDetails = await this.createDetails(details);

    await this.createState(userClient, StateName.ACTIVE, null);

    await this.createRole(userClient);

    return {
      user: userClient,
      userDetails,
      role: Role.CLIENT,
    };
  }

  async getActive(email: string): Promise<UserClient> {
    return await this.userClientRepository
      .createQueryBuilder('userClient')
      .innerJoin('userClient.stateUser', 'su')
      .innerJoin('su.state', 'state')
      .where(`userClient.email = '${email}'`)
      .andWhere(`state.name = '${StateName.ACTIVE}'`)
      .andWhere('su."finalDate" is null')
      .getOne();
  }

  async get(credentials: {
    email?: string;
    idUserClient?: number;
  }): Promise<UserClient> {
    const { email, idUserClient } = credentials;
    if (idUserClient)
      return await this.userClientRepository.findOne({ idUserClient });
    return await this.userClientRepository.findOne({ email });
  }

  async getInfo(idUserClient: number): Promise<UserInfo> {
    const userClient = await this.get({ idUserClient });
    return {
      email: userClient.email,
      userDetails: userClient.userDetails,
      role: Role.CLIENT,
      id: userClient.idUserClient,
      federated: userClient.password ? false : true,
    };
  }

  async getPoints(idUserClient: number): Promise<ClientPoints> {
    const email = (await this.userClientRepository.findOne({ idUserClient }))
      .email;

    let points = await getConnection()
      .createQueryBuilder()
      .select('clientPoints.dollars')
      .addSelect('clientPoints.points')
      .from(ClientPoints, 'clientPoints')
      .where(`email='${email}'`)
      .getOne();

    if (!points) {
      points = new ClientPoints();
      points.dollars = 0;
      points.points = 0;
    }

    return points;
  }

  async getDetails(userClient: UserClient): Promise<UserDetails> {
    if (userClient)
      return await this.userDetailsRepository.findOne({
        where: `fk_user_client = ${userClient.idUserClient}`,
      });
    return null;
  }

  async updateDefaultLanguage(
    email: string,
    language: string,
  ): Promise<Language> {
    const userClient = await this.userClientRepository.findOne({ email });

    const languageFound = await getConnection()
      .getRepository(Language)
      .findOne({ name: language });

    const userDetails = await this.userDetailsRepository.findOne({
      userClient,
    });
    userDetails.language = languageFound;
    await this.userDetailsRepository.save(userDetails);

    return languageFound;
  }

  async updatePassword(user, credentials: UpdatePasswordDTO) {
    const { password, currentPassword, salt } = credentials;
    const userClient = await this.get({ idUserClient: user.id });

    if (await userClient.isPasswordCorrect(currentPassword)) {
      await this.userClientRepository
        .createQueryBuilder()
        .update(UserClient)
        .set({ password, salt })
        .where('idUserClient = :id', { id: userClient.idUserClient })
        .execute();

      this.logger.silly(
        `[${ApiModules.USER}] {${user.email}} Password successfully updated`,
      );
      return userClient;
    }

    this.logger.error(
      `[${ApiModules.USER}] {${user.email}}  Could not update password | Incorrect password`,
    );
    throw new UnauthorizedException('error-messages.incorrectPassword');
  }

  async updatePasswordWithoutCurrent(user, credentials) {
    const { password, salt } = credentials;
    const userClient = await this.get({ idUserClient: user.id });

    await this.userClientRepository
      .createQueryBuilder()
      .update(UserClient)
      .set({ password, salt })
      .where('idUserClient = :id', { id: userClient.idUserClient })
      .execute();

    this.logger.silly(
      `[${ApiModules.USER}] {${user.email}} Password successfully updated`,
    );
    return userClient;
  }
}
