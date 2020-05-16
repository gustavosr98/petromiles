import { Injectable } from '@nestjs/common';

import { getConnection } from 'typeorm';

import { UserClient } from '../../client/user-client/user-client.entity';
import { RoleService } from '../../management/role/role.service';
import { Role } from 'src/modules/management/role/role.enum';
import { UserRole } from './user-role.entity';

@Injectable()
export class UserRoleService {
  private connection = getConnection();

  constructor(private roleService: RoleService) {}

  async createClientRole(user: UserClient): Promise<UserRole> {
    const role = await this.roleService.getRoleByName(Role.CLIENT);

    const userRole = new UserRole();
    userRole.role = role;
    userRole.userClient = user;

    return await this.connection.manager.save(userRole);
  }
}
