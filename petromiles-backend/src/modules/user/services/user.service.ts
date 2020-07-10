import { ApiModules } from '@/logger/api-modules.enum';
import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

// SERVICES
import { UserAdministratorService } from '@/modules/user/services/user-administrator.service';

// ENTITIES
import { UserClient } from '@/entities/user-client.entity';
import { UserDetails } from '@/entities/user-details.entity';
import { UserAdministrator } from '@/entities/user-administrator.entity';

// INTERFACES
import { Role } from '@/enums/role.enum';
import { UserClientService } from '@/modules/user/services/user-client.service';
import { UpdateDetailsDTO } from '@/modules/user/dto/update-details.dto';
import { UserInfo } from '@/interfaces/user/user-info.interface';

@Injectable()
export class UserService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    @InjectRepository(UserDetails)
    private userDetailsRepository: Repository<UserDetails>,
    private userClientService: UserClientService,
    private userAdministratorService: UserAdministratorService,
  ) {}

  // ANY ROLE
  async findAll(role: string): Promise<UserClient[] | UserAdministrator[]> {
    if (role === Role.CLIENT) {
      const clients = await this.userClientService.findAll();
      return clients;
    } else if (role === Role.ADMINISTRATOR) {
      const admins = await this.userAdministratorService.findAll();
      return admins;
    }
  }

  async findInfo(id: number, role: string): Promise<UserInfo> {
    if (role === Role.ADMINISTRATOR)
      return await this.userAdministratorService.getInfo(id);

    return await this.userClientService.getInfo(id);
  }

  async getActive(credentials: App.Auth.LoginRequest) {
    const { email, role } = credentials;
    let user, userDetails;
    if (role === Role.ADMINISTRATOR) {
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

  async updateDetails(
    id: number,
    details: UpdateDetailsDTO,
  ): Promise<UpdateResult> {
    const { role, ...userDetails } = details;

    if (role === Role.CLIENT.toLowerCase() || role === Role.ADMINISTRATOR.toLowerCase()) {
      return await this.userDetailsRepository
      .createQueryBuilder()
      .update(UserDetails)
      .set({ ...userDetails })
      .where(`fk_user_${role} = :id`, { id })
      .execute();
    }
    else {
      this.logger.error(
        `[${ApiModules.USER}] Unknown Role: {${role}}`,
      );
      throw new BadRequestException('error-messages.unknownRole');
    }    
  }
}
