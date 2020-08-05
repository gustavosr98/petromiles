import {
  Injectable,
  BadRequestException,
  Inject,
  OnModuleInit,
} from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import * as bcrypt from 'bcrypt';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

import { ApiModules } from '@/logger/api-modules.enum';

// SERVICES
import { UserAdministratorService } from '@/modules/user/services/user-administrator.service';
import { ManagementService } from '@/modules/management/services/management.service';

// ENTITIES
import { UserClient } from '@/entities/user-client.entity';
import { UserDetails } from '@/entities/user-details.entity';
import { UserAdministrator } from '@/entities/user-administrator.entity';
import { BankAccount } from '@/entities/bank-account.entity';

// INTERFACES
import { Role as RoleType } from '@/enums/role.enum';
import { UserClientService } from '@/modules/user/services/user-client.service';
import { UpdateDetailsDTO } from '@/modules/user/dto/update-details.dto';
import { UserInfo } from '@/interfaces/user/user-info.interface';
import { StateName } from '@/enums/state.enum';
import { ClientBankAccountService } from '@/modules/bank-account/services/client-bank-account.service';
import { AuthenticatedUser } from '@/interfaces/auth/authenticated-user.interface';

@Injectable()
export class UserService implements OnModuleInit {
  clientBankAccountService: ClientBankAccountService;

  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    @InjectRepository(UserDetails)
    private userDetailsRepository: Repository<UserDetails>,
    private userClientService: UserClientService,
    private userAdministratorService: UserAdministratorService,
    private managementService: ManagementService,
    private moduleRef: ModuleRef,
  ) {}

  onModuleInit() {
    this.clientBankAccountService = this.moduleRef.get(
      ClientBankAccountService,
      { strict: false },
    );
  }
  // ANY ROLE
  async findAll(role: string): Promise<UserClient[] | UserAdministrator[]> {
    if (role === RoleType.CLIENT) {
      const clients = await this.userClientService.findAll();
      return clients;
    } else if (role === RoleType.ADMINISTRATOR) {
      const admins = await this.userAdministratorService.findAll();
      return admins;
    }
  }

  async findInfo(id: number, role: string): Promise<UserInfo> {
    if (role === RoleType.ADMINISTRATOR)
      return await this.userAdministratorService.getInfo(id);

    return await this.userClientService.getInfo(id);
  }

  async getActive(credentials: App.Auth.LoginRequest) {
    const { email, role } = credentials;
    let user, userDetails;
    if (role === RoleType.ADMINISTRATOR) {
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
    allUserInfo: boolean,
  ): Promise<UpdateResult> {
    const { role, ...userDetails } = details;

    if (
      role === RoleType.CLIENT.toLowerCase() ||
      role === RoleType.ADMINISTRATOR.toLowerCase()
    ) {
      const query = this.userDetailsRepository
        .createQueryBuilder()
        .update(UserDetails)
        .set({ ...userDetails })
        .where(`fk_user_${role} = :id`, { id });

      if (!allUserInfo)
        return query.andWhere('"accountOwner" IS  NULL').execute();
      else query.execute();
    } else {
      this.logger.error(`[${ApiModules.USER}] Unknown Role: {${role}}`);
      throw new BadRequestException('error-messages.unknownRole');
    }
  }

  async deletePersonalInfo(user: AuthenticatedUser): Promise<UpdateResult> {
    const { id, email, role } = user;
    const clientBankAccounts = await this.clientBankAccountService.getClientBankAccounts(
      id,
    );
    const roleType = await this.managementService.getRoleByName(role);

    if (
      !(await this.checkPendingTransactions(id, clientBankAccounts)) ||
      roleType.isAdministrator()
    ) {
      await this.clientBankAccountService.encryptBankAccount(
        clientBankAccounts,
      );
      await this.managementService.updateUserState(role, StateName.DELETED, id);
      const userDetail = await this.userDetailsRepository.findOne(id);

      // UserDetails will be encrypted
      const encrypedData: UpdateDetailsDTO = {
        firstName: await this.encrypt(userDetail.firstName),
        middleName: await this.encrypt(userDetail.middleName),
        lastName: await this.encrypt(userDetail.lastName),
        secondLastName: await this.encrypt(userDetail.secondLastName),
        birthdate: null,
        address: await this.encrypt(userDetail.address),
        phone: await this.encrypt(userDetail.phone),
        photo: await this.encrypt(userDetail.photo),
        country: null,
        role: role.toLowerCase(),
        accountId: await this.encrypt(userDetail.accountId),
        customerId: await this.encrypt(userDetail.customerId),
      };

      await this.updateDetails(id, encrypedData, true);

      // Email will be encrypted
      let updatedResult;
      if (roleType.isClient())
        updatedResult = await this.userClientService.updateClient(
          { email: `EncryptedEmail${id}@petromiles.com` },
          id,
        );
      else if (roleType.isAdministrator())
        updatedResult = await this.userAdministratorService.updateAdministrator(
          { email: `EncryptedEmail${id}@petromiles.com` },
          id,
        );

      this.logger.silly(
        `[${ApiModules.USER}]  Delete data request sucessfully processed`,
      );
      return updatedResult;
    }

    throw new BadRequestException('error-messages.couldNotDeleteAccount');
  }

  async checkPendingTransactions(
    idUserClient: number,
    clientBankAccounts: BankAccount[],
  ) {
    const pendingArray = await Promise.all(
      clientBankAccounts.map(async clientBankAccount => {
        const isPending = await this.clientBankAccountService.hasPendingTransaction(
          await this.clientBankAccountService.getOne(
            idUserClient,
            clientBankAccount.idBankAccount,
          ),
        );
        return isPending;
      }),
    );

    return pendingArray.includes(true) ? true : false;
  }

  async encrypt(dataToEncrypt){
    const encrypted = await bcrypt.hash(dataToEncrypt, bcrypt.genSatl());
    return encrypted;
  }
}
