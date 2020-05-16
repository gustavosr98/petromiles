import { Injectable } from '@nestjs/common';

import { Role as RoleEnum } from 'src/modules/management/role/role.enum';
import { UserClientService } from '../client/user-client/user-client.service';
import { UserAdministratorService } from './user-administrator/user-administrator.service';
import { UserDetailsService } from './user-details/user-details.service';

@Injectable()
export class UserService {
  constructor(
    private userClientService: UserClientService,
    private userAdministratorService: UserAdministratorService,
    private userDetailsService: UserDetailsService,
  ) {}

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
      };
      return { user: credentials, userDetails };
    }
    return null;
  }
}
