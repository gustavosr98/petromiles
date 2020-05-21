import { Injectable } from '@nestjs/common';

import { Role as RoleEnum } from 'src/modules/management/role/role.enum';
import { UserClientService } from './user-client/user-client.service';
import { UserAdministratorService } from './user-administrator/user-administrator.service';
import { UserDetailsService } from './user-details/user-details.service';

@Injectable()
export class UserService {
  constructor(
    private userClientService: UserClientService,
    private userAdministratorService: UserAdministratorService,
    private userDetailsService: UserDetailsService,
  ) {}

  // ANY ROLE
  async findAll(role: string) {
    if (role === RoleEnum.CLIENT) {
      const clients = await this.userClientService.findAll();
      return clients;
    } else if (role === RoleEnum.ADMINISTRATOR) {
      const admins = await this.userAdministratorService.findAll();
      return admins;
    }
  }

  async getUserByEmail(credentials: App.Auth.LoginRequest) {
    const { email, role } = credentials;
    let user, userDetails;
    if (role === RoleEnum.ADMINISTRATOR) {
      user = await this.userAdministratorService.getActiveAdministrator(email);
      userDetails = await this.userDetailsService.getAdministratorDetails(user);
    } else {
      user = await this.userClientService.getActiveClient(email);
      userDetails = await this.userDetailsService.getClientDetails(user);
    }

    if (user) {
      const credentials = {
        password: user.password,
        email: user.email,
        salt: user.salt,
        id:
          user.idUserAdministrator !== undefined
            ? user.idUserAdministrator
            : user.idUserClient,
      };
      return { user: credentials, userDetails };
    }
    return null;
  }
}
