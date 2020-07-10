import { ApiModules } from '@/logger/api-modules.enum';
import { Injectable, Inject, BadRequestException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

import { getConnection, Repository } from 'typeorm';

// SERVICES
import { ManagementService } from '@/modules/management/services/management.service';

// ENTITIES
import { StateUser } from '@/entities/state-user.entity';
import { State } from '@/entities/state.entity';
import { UserAdministrator } from '@/entities/user-administrator.entity';
import { UserDetails } from '@/entities/user-details.entity';
import { UserRole } from '@/entities/user-role.entity';

// INTERFACES
import { StateName } from '@/enums/state.enum';
import { Language as LanguageEnum } from '@/enums/language.enum';
import { CreateUserDTO } from '@/modules/user/dto/create-user.dto';
import { Role } from '@/enums/role.enum';
import { UserInfo } from '@/interfaces/user/user-info.interface';

@Injectable()
export class UserAdministratorService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    @InjectRepository(UserAdministrator)
    private userAdministratorRepository: Repository<UserAdministrator>,
    @InjectRepository(UserDetails)
    private userDetailsRepository: Repository<UserDetails>,
    private managementService: ManagementService,
  ) {}

  async findAll(): Promise<UserAdministrator[]> {
    return await this.userAdministratorRepository.find({
      relations: ['stateUser', 'userDetails', 'userRole'],
    });
  }

  async create(
    createUserDTO: CreateUserDTO,
  ): Promise<App.Auth.UserAdministrator> {
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
    const userAdministrator = await this.userAdministratorRepository.save(user);

    const userAdministratorDetails = await this.completeRegistration(
      userAdministrator,
      {
        firstName,
        lastName,
        middleName,
        secondLastName,
        birthdate,
        address,
        phone,
        photo,
        language: await this.managementService.getLanguage(
          LanguageEnum.ENGLISH,
        ),
        userAdministrator,
      },
    );

    this.logger.silly(
      `[${ApiModules.USER}] Administrator with ID: ${userAdministrator.idUserAdministrator} was successfully registered`,
    );
    return userAdministratorDetails;
  }

  async createRole(user: UserAdministrator): Promise<UserRole> {
    const role = await this.managementService.getRoleByName(Role.ADMINISTRATOR);

    const userRole = new UserRole();
    userRole.role = role;
    userRole.userAdministrator = user;

    return await getConnection()
      .getRepository(UserRole)
      .save(userRole);
  }

  async createState(
    user: UserAdministrator,
    stateName: StateName,
    description: string,
  ): Promise<StateUser> {
    const userState = new StateUser();
    userState.userAdministrator = user;
    userState.initialDate = new Date();
    userState.description = description;
    userState.state = await this.managementService.getState(stateName);
    return await getConnection()
      .getRepository(StateUser)
      .save(userState);
  }

  async createDetails(userAdministratorDetails): Promise<UserDetails> {
    const result = await this.userDetailsRepository.save(
      userAdministratorDetails,
    );
    result.userAdministrator = null;
    return result;
  }

  private async completeRegistration(
    userAdministrator: UserAdministrator,
    details,
  ): Promise<App.Auth.UserAdministrator> {
    const userDetails = await this.createDetails(details);

    await this.createState(userAdministrator, StateName.ACTIVE, null);

    await this.createRole(userAdministrator);

    return {
      userAdmin: userAdministrator,
      userDetails,
      role: Role.ADMINISTRATOR,
    };
  }

  async getActive(email: string): Promise<UserAdministrator> {
    return await getConnection()
      .createQueryBuilder()
      .select('admin')
      .from(UserAdministrator, 'admin')
      .innerJoin(
        StateUser,
        'state_user',
        'state_user.fk_user_administrator = admin."idUserAdministrator"',
      )
      .innerJoin(State, 'state', 'state."idState" = state_user.fk_state')
      .where(`admin.email = '${email}'`)
      .andWhere(`state.name = '${StateName.ACTIVE}'`)
      .andWhere('state_user."finalDate" is null')
      .getOne();
  }

  async get(credentials: {
    email?: string;
    idUserAdministrator?: number;
  }): Promise<UserAdministrator> {
    const { email, idUserAdministrator } = credentials;
    if (idUserAdministrator)
      return await this.userAdministratorRepository.findOne({
        idUserAdministrator,
      });
    return await this.userAdministratorRepository.findOne({ email });
  }

  async getDetails(userAdministrator: UserAdministrator): Promise<UserDetails> {
    if (userAdministrator)
      return await this.userDetailsRepository.findOne({
        where: `fk_user_administrator = ${userAdministrator.idUserAdministrator}`,
      });

    return null;
  }

  async getInfo(idUserAdministrator: number): Promise<UserInfo> {
    const userAdministrator = await this.userAdministratorRepository.findOne({
      idUserAdministrator,
    });
    return {
      email: userAdministrator.email,
      userDetails: userAdministrator.userDetails,
      role: Role.ADMINISTRATOR,
      id: userAdministrator.idUserAdministrator,
      federated: false,
    };
  }

  async updatePasswordWithoutCurrent(user, credentials) {
    const { password, salt } = credentials;
    const userAdmin = await this.get({ idUserAdministrator: user.id });

    await this.userAdministratorRepository
      .createQueryBuilder()
      .update(UserAdministrator)
      .set({ password, salt })
      .where('idUserAdministrator = :id', { id: userAdmin.idUserAdministrator })
      .execute();

    this.logger.silly(
      `[${ApiModules.USER}] {${user.email}} Password successfully updated`,
    );
    return userAdmin;
  }
}
