/* eslint-disable @typescript-eslint/camelcase */

import { Injectable, UseInterceptors } from '@nestjs/common';
import { UserClient } from './user-client.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { StateUserService } from '../../user/state-user/state-user.service';
import { Role } from '../../management/role/role.enum';
import { UserRoleService } from '../../user/user-role/user-role.service';
import { CreateUserDTO } from '../../user/dto/create-user.dto';
import { UserDetailsService } from '../../user/user-details/user-details.service';
import { StateName } from '../../management/state/state.enum';

@Injectable()
export class UserClientService {
  constructor(
    @InjectRepository(UserClient)
    private userClientRepository: Repository<UserClient>,
    private stateUserService: StateUserService,
    private userRoleService: UserRoleService,
    private userDetailsService: UserDetailsService,
  ) {}

  async getUserClientByEmail(email: string): Promise<UserClient> {
    const user = await this.userClientRepository.findOne({ email });
    return user;
  }

  async createUser(credentials: CreateUserDTO): Promise<App.Auth.UserClient> {
    // 1) Se toma la informacion del usuario
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

    //2) Se crea usuario en la entidad cliente
    const userClient = await this.userClientRepository.save(user);

    //3) Crea status, role, y los detalles del usuario
    return await this.completeRegistrationClient(userClient, {
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
    });
  }

  private async completeRegistrationClient(
    userClient: UserClient,
    details,
  ): Promise<App.Auth.UserClient> {
    // 1) Se crean los detalles del usuario
    const userDetails = await this.userDetailsService.createUserClientDetails(
      details,
    );

    // 2)Se crean el estado del usuario
    await this.stateUserService.createStateUserClient(
      userClient,
      StateName.ACTIVE,
      null,
    );

    // Se crean el rol del usuario
    await this.userRoleService.createUserRoleClient(userClient);

    return {
      user: userClient,
      userDetails: userDetails,
      role: Role.CLIENT,
    };
  }
}
