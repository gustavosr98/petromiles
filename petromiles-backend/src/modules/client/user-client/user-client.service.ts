import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository, getConnection } from 'typeorm';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

import { UserClient } from './user-client.entity';
import { StateUserService } from '../../user/state-user/state-user.service';
import { Role } from '../../management/role/role.enum';
import { UserRoleService } from '../../user/user-role/user-role.service';
import { CreateUserDTO } from '../../user/dto/create-user.dto';
import { UserDetailsService } from '../../user/user-details/user-details.service';
import { StateName } from '../../management/state/state.enum';
import { StateUser } from '../../user/state-user/state-user.entity';
import { State } from '../../management/state/state.entity';

@Injectable()
export class UserClientService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    @InjectRepository(UserClient)
    private userClientRepository: Repository<UserClient>,
    private stateUserService: StateUserService,
    private userRoleService: UserRoleService,
    private userDetailsService: UserDetailsService,
  ) {}

  async createUser(credentials: CreateUserDTO): Promise<App.Auth.UserClient> {
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
    } = credentials;

    if (await this.getClient(user.email))
      throw new BadRequestException('User already in use');

    const userClient = await this.userClientRepository.save(user);

    const userClientDetails = await this.completeRegistrationClient(
      userClient,
      {
        firstName,
        lastName,
        middleName,
        secondLastName,
        birthdate,
        address,
        phone,
        photo,
        language: await this.userDetailsService.getLanguage('en'),
        userClient,
      },
    );

    this.logger.silly(
      `[AUTH] Client with ID: ${userClient.idUserClient} is successfully registered`,
    );
    return userClientDetails;
  }

  private async completeRegistrationClient(
    userClient: UserClient,
    details,
  ): Promise<App.Auth.UserClient> {
    const userDetails = await this.userDetailsService.createClientDetails(
      details,
    );

    await this.stateUserService.createClientState(
      userClient,
      StateName.ACTIVE,
      null,
    );

    await this.userRoleService.createClientRole(userClient);

    return {
      user: userClient,
      userDetails,
      role: Role.CLIENT,
    };
  }

  async getActiveClient(email: string): Promise<UserClient> {
    return await getConnection()
      .createQueryBuilder()
      .select('client')
      .from(UserClient, 'client')
      .innerJoin(
        StateUser,
        'state_user',
        'state_user.fk_user_client = client."idUserClient"',
      )
      .innerJoin(State, 'state', 'state."idState" = state_user.fk_state')
      .where(`client.email = '${email}'`)
      .andWhere(`state.name = '${StateName.ACTIVE}'`)
      .andWhere('state_user."finalDate" is null')
      .getOne();
  }

  async getClient(email: string): Promise<UserClient> {
    return await this.userClientRepository.findOne({ email });
  }
}
