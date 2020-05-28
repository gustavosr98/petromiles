import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getManager, getConnection, Repository } from 'typeorm';

// SERVICES
import { UserClientService } from './user-client/user-client.service';
import { UserAdministratorService } from './user-administrator/user-administrator.service';
import { UserDetailsService } from './user-details/user-details.service';

// ENTITIES
import { ClientPoints } from './user-client/user-points.entity';
import { UserClient } from './user-client/user-client.entity';
import { Language } from './language/language.entity';
import { UserDetails } from './user-details/user-details.entity';

// INTERFACES
import { Role as RoleEnum } from 'src/modules/management/role/role.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserClient)
    private userClientRepository: Repository<UserClient>,
    @InjectRepository(UserDetails)
    private userDetailsRepository: Repository<UserDetails>,
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

  async getClient(email: string): Promise<UserClient> {
    return await this.userClientService.getClient(email);
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

  async getPoints(email: string): Promise<ClientPoints> {
    let points = await getManager()
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

  async changeUserLanguage(email: string, language: string) {
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
}
