import { ApiModules } from '@/logger/api-modules.enum';
import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository, getConnection } from 'typeorm';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

// INTERFACES
import { CreateUserDTO } from '../dto/create-user.dto';
import { StateName } from '../../management/state/state.enum';
import { Role } from '../../management/role/role.enum';
import { Language } from '../language/language.enum';

// SERVICES
import { StateUserService } from '../state-user/state-user.service';
import { UserRoleService } from '../user-role/user-role.service';
import { UserDetailsService } from '../user-details/user-details.service';
import { PaymentProviderService } from '@/modules/payment-provider/payment-provider.service';

//  ENTITIES
import { UserClient } from './user-client.entity';
import { StateUser } from '../state-user/state-user.entity';
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
    private paymentProviderService: PaymentProviderService,
  ) {}

  async findAll() {
    return await this.userClientRepository.find();
  }

  async createUser(createUserDTO: CreateUserDTO): Promise<App.Auth.UserClient> {
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

    if (await this.getClient(user.email)) {
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
        customerId: paymentProviderCustomer.id,
      },
    );

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
        language: await this.userDetailsService.getLanguage(Language.ENGLISH),
        userClient,
        customerId: paymentProviderCustomer.id,
        accountId: paymentProviderAccount.id,
      },
    );

    this.logger.silly(
      `[${ApiModules.USER}] Client with ID: ${userClient.idUserClient} was successfully registered`,
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
