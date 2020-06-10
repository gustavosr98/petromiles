import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// SERVICES
import { UserAdministratorService } from '@/modules/user/services/user-administrator.service';

// ENTITIES
import { UserClient } from '@/entities/user-client.entity';
import { UserDetails } from '@/entities/user-details.entity';
import { UserAdministrator } from '@/entities/user-administrator.entity';

// INTERFACES
import { Role as RoleEnum } from '@/enums/role.enum';
import { UserClientService } from '@/modules/user/services/user-client.service';

@Injectable()
export class UserService {
  constructor(
    private userClientService: UserClientService,
    private userAdministratorService: UserAdministratorService,
  ) {}

  // ANY ROLE
  async findAll(role: string): Promise<UserClient[] | UserAdministrator[]> {
    if (role === RoleEnum.CLIENT) {
      const clients = await this.userClientService.findAll();
      return clients;
    } else if (role === RoleEnum.ADMINISTRATOR) {
      const admins = await this.userAdministratorService.findAll();
      return admins;
    }
  }

  async getActive(credentials: App.Auth.LoginRequest) {
    const { email, role } = credentials;
    let user, userDetails;
    if (role === RoleEnum.ADMINISTRATOR) {
      user = await this.userAdministratorService.getActive(email);
      userDetails = await this.userAdministratorService.getDetails(user);
    } else {
      user = await this.userClientService.getActive(email);
      userDetails = await this.userClientService.getDetails(user);
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
