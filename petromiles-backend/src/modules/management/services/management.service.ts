import { BadRequestException, Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository, getConnection, UpdateResult, In } from 'typeorm';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

// ENTITIES
import { Language } from '@/entities/language.entity';
import { State } from '@/entities/state.entity';
import { Role } from '@/entities/role.entity';
import { StateUser } from '@/entities/state-user.entity';
import { UserClient } from '@/entities/user-client.entity';
import { Suscription } from '@/entities/suscription.entity';
import { UserAdministrator } from '@/entities/user-administrator.entity';
import { Country } from '@/entities/country.entity';
import { Bank } from '@/entities/bank.entity';
import { Transaction } from '@/entities/transaction.entity';
import { ClientBankAccount } from '@/entities/client-bank-account.entity';
import { StateBankAccount } from '@/entities/state-bank-account.entity';
import { UserRole } from '@/entities/user-role.entity';

// INTERFACES
import { StateName } from '@/enums/state.enum';
import { Role as RoleEnum } from '@/enums/role.enum';
import { TransactionType } from '@/enums/transaction.enum';
import { UpdateSubscriptionDTO } from '@/modules/suscription/dto/update-subscription.dto';
import { ApiModules } from '@/logger/api-modules.enum';
import { PointsToDollars } from '@/interfaces/management/points-to-dollars.interface';
import { PointsDetails } from '@/interfaces/management/points-details.interface';

// SERVICES
import { PointsConversionService } from '@/modules/management/services/points-conversion.service';
import { AuthenticatedUser } from '@/interfaces/auth/authenticated-user.interface';

@Injectable()
export class ManagementService {
  constructor(
    @InjectRepository(Language)
    private languageRepository: Repository<Language>,
    @InjectRepository(State)
    private stateRepository: Repository<State>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(Country)
    private countryRepository: Repository<Country>,
    @InjectRepository(UserClient)
    private userClientRepository: Repository<UserClient>,
    @InjectRepository(UserAdministrator)
    private userAdministratorRepository: Repository<UserAdministrator>,
    @InjectRepository(StateUser)
    private stateUserRepository: Repository<StateUser>,
    @InjectRepository(Bank)
    private bankRepository: Repository<Bank>,
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private pointsConversionService: PointsConversionService,
  ) {}

  async getLanguages(): Promise<Language[]> {
    return await this.languageRepository.find();
  }

  async getLanguage(name: string): Promise<Language> {
    return await this.languageRepository.findOne({ name });
  }

  async getCountries(): Promise<Country[]> {
    return await this.countryRepository.find();
  }

  async getState(name: StateName): Promise<State> {
    return await this.stateRepository.findOne({ name });
  }

  async getRoleByName(name: RoleEnum): Promise<Role> {
    return await this.roleRepository.findOne({ name });
  }

  async getBanks(): Promise<Bank[]> {
    return await this.bankRepository.find();
  }

  async getPointsDetails(): Promise<PointsDetails> {
    const purchasedPoints = await this.getTotalPoints(1);
    const redeemedPoints = await this.getTotalPoints(-1);
    return {
      purchasedPoints,
      redeemedPoints,
      total: {
        dollars: parseFloat(
          (purchasedPoints.dollars - redeemedPoints.dollars).toFixed(2),
        ),
        points: purchasedPoints.points - redeemedPoints.points,
      },
    };
  }

  async getTotalPoints(operation: number): Promise<PointsToDollars> {
    const conversion = (
      await this.pointsConversionService.getRecentPointsConversion()
    ).onePointEqualsDollars;

    const dollars =
      (
        await this.transactionRepository
          .createQueryBuilder('transaction')
          .select('SUM(transaction."rawAmount")', 'cents')
          .innerJoin('transaction.stateTransaction', 'st')
          .innerJoin('st.state', 's')
          .where(`transaction.operation = ${operation}`)
          .andWhere(`s.name  = '${StateName.VALID}'`)
          .getRawOne()
      ).cents / 100;
    const points = Math.trunc(dollars / conversion);
    return { dollars: parseFloat(dollars.toFixed(2)), points };
  }

  async getStatistics(user: AuthenticatedUser): Promise<App.Statistics> {
    if (user.role === RoleEnum.CLIENT) {
      // transaction totals for a customer
      let totalInvalidDeposit = 0;
      let totalValidDeposit = 0;
      let totalPendingDeposit = 0;
      let totalInvalidWithdrawal = 0;
      let totalValidWithdrawal = 0;
      let totalPendingWithdrawal = 0;
      let totalInvalidClient = 0;
      let totalValidClient = 0;
      let totalPendingClient = 0;
      // transaction totals of a customer's bank accounts
      let totalCancelledBankAccount = 0;
      let totalActiveBankAccount = 0;
      let totalPendingBankAccount = 0;

      const transactions = await this.transactionRepository.find({
        where: `(userClient.email = '${user.email}' OR user.email= '${user.email}') AND stateTransaction.finalDate is null`,
        join: {
          alias: 'transaction',
          leftJoinAndSelect: {
            clientOnThirdParty: 'transaction.clientOnThirdParty',
            user: 'clientOnThirdParty.userClient',
            clientBankAccount: 'transaction.clientBankAccount',
            bankAccount: 'clientBankAccount.bankAccount',
            stateTransaction: 'transaction.stateTransaction',
            state: 'stateTransaction.state',
            userClient: 'clientBankAccount.userClient',
          },
        },
      });
      const clientBankAccounts = await getConnection()
        .getRepository(ClientBankAccount)
        .find({
          where: `"userClient"."idUserClient" ='${user.id}'`,
          join: {
            alias: 'clientBankAccount',
            innerJoinAndSelect: {
              stateBankAccount: 'clientBankAccount.stateBankAccount',
              userClient: 'clientBankAccount.userClient',
              state: 'stateBankAccount.state',
            },
          },
        });

      for (let index = 0; index < transactions.length; index++) {
        const stateTransaction =
          transactions[index].stateTransaction[
            transactions[index].stateTransaction.length - 1
          ].state.name;

        if (transactions[index].type === TransactionType.DEPOSIT) {
          if (stateTransaction === StateName.INVALID) totalInvalidDeposit++;
          else if (stateTransaction === StateName.VALID) totalValidDeposit++;
          else if (stateTransaction === StateName.VERIFYING)
            totalPendingDeposit++;
        } else if (transactions[index].type === TransactionType.WITHDRAWAL) {
          if (stateTransaction === StateName.INVALID) totalInvalidWithdrawal++;
          else if (stateTransaction === StateName.VALID) totalValidWithdrawal++;
          else if (stateTransaction === StateName.VERIFYING)
            totalPendingWithdrawal++;
        } else if (
          transactions[index].type === TransactionType.THIRD_PARTY_CLIENT
        ) {
          if (stateTransaction === StateName.INVALID) totalInvalidClient++;
          else if (stateTransaction === StateName.VALID) totalValidClient++;
          else if (stateTransaction === StateName.VERIFYING)
            totalPendingClient++;
        }
      }

      for (let index = 0; index < clientBankAccounts.length; index++) {
        const stateBankAccount = await getConnection()
          .getRepository(StateBankAccount)
          .findOne({
            where: `"clientBankAccount"."idClientBankAccount" = '${clientBankAccounts[index].idClientBankAccount}' AND stateBannkAccount.finalDate is null`,
            join: {
              alias: 'stateBannkAccount',
              leftJoinAndSelect: {
                clientBankAccount: 'stateBannkAccount.clientBankAccount',
                state: 'stateBannkAccount.state',
              },
            },
          });

        if (stateBankAccount.state.name === StateName.CANCELLED)
          totalCancelledBankAccount++;
        else if (stateBankAccount.state.name === StateName.ACTIVE)
          totalActiveBankAccount++;
        else if (stateBankAccount.state.name === StateName.VERIFYING)
          totalPendingBankAccount++;
      }

      const totalTransaccionsDeposit =
        totalInvalidDeposit + totalValidDeposit + totalPendingDeposit;
      const totalTransaccionsWithdrawal =
        totalInvalidWithdrawal + totalValidWithdrawal + totalPendingWithdrawal;
      const totalTransaccionsClient =
        totalInvalidClient + totalValidClient + totalPendingClient;
      const totalTransaccions =
        totalTransaccionsDeposit +
        totalTransaccionsWithdrawal +
        totalTransaccionsClient;

      const totalClientBankAccount =
        totalCancelledBankAccount +
        totalActiveBankAccount +
        totalPendingBankAccount;

      return {
        transactions: {
          addPoints: {
            totalInvalid: totalInvalidDeposit,
            totalValid: totalValidDeposit,
            totalPending: totalPendingDeposit,
            total: totalTransaccionsDeposit,
          },
          exchangePoints: {
            totalInvalid: totalInvalidWithdrawal,
            totalValid: totalValidWithdrawal,
            totalPending: totalPendingWithdrawal,
            total: totalTransaccionsWithdrawal,
          },
          thirdPartyClient: {
            totalInvalid: totalInvalidClient,
            totalValid: totalValidClient,
            totalPending: totalPendingClient,
            total: totalTransaccionsClient,
          },
          total: totalTransaccions,
        },
        clientBankAccounts: {
          totalInvalid: totalCancelledBankAccount,
          totalValid: totalActiveBankAccount,
          totalPending: totalPendingBankAccount,
          total: totalClientBankAccount,
        },
      };
    } else if (user.role === RoleEnum.ADMINISTRATOR) {
      // customer transaction totals
      let totalInvalidDeposit = 0;
      let totalValidDeposit = 0;
      let totalPendingDeposit = 0;
      let totalInvalidWithdrawal = 0;
      let totalValidWithdrawal = 0;
      let totalPendingWithdrawal = 0;
      let totalInvalidClient = 0;
      let totalValidClient = 0;
      let totalPendingClient = 0;
      // transaction totals for customer bank accounts
      let totalBlockedBankAccount = 0;
      let totalActiveBankAccount = 0;
      let totalPendingBankAccount = 0;
      // total users
      let totalBlockedClients = 0;
      let totalActiveClients = 0;
      let totalBlockedAdmins = 0;
      let totalActiveAdmins = 0;

      const transactions = await this.transactionRepository.find({
        where: `stateTransaction.finalDate is null`,
        join: {
          alias: 'transaction',
          leftJoinAndSelect: {
            clientOnThirdParty: 'transaction.clientOnThirdParty',
            user: 'clientOnThirdParty.userClient',
            clientBankAccount: 'transaction.clientBankAccount',
            bankAccount: 'clientBankAccount.bankAccount',
            stateTransaction: 'transaction.stateTransaction',
            state: 'stateTransaction.state',
            userClient: 'clientBankAccount.userClient',
          },
        },
      });
      const clientBankAccounts = await getConnection()
        .getRepository(ClientBankAccount)
        .find();
      const adminUser = await getConnection()
        .getRepository(UserAdministrator)
        .find();
      const clientUser = await getConnection()
        .getRepository(UserClient)
        .find();

      for (let index = 0; index < transactions.length; index++) {
        const stateTransaction =
          transactions[index].stateTransaction[
            transactions[index].stateTransaction.length - 1
          ].state.name;

        if (transactions[index].type === TransactionType.DEPOSIT) {
          if (stateTransaction === StateName.INVALID) totalInvalidDeposit++;
          else if (stateTransaction === StateName.VALID) totalValidDeposit++;
          else if (stateTransaction === StateName.VERIFYING)
            totalPendingDeposit++;
        } else if (transactions[index].type === TransactionType.WITHDRAWAL) {
          if (stateTransaction === StateName.INVALID) totalInvalidWithdrawal++;
          else if (stateTransaction === StateName.VALID) totalValidWithdrawal++;
          else if (stateTransaction === StateName.VERIFYING)
            totalPendingWithdrawal++;
        } else if (
          transactions[index].type === TransactionType.THIRD_PARTY_CLIENT
        ) {
          if (stateTransaction === StateName.INVALID) totalInvalidClient++;
          else if (stateTransaction === StateName.VALID) totalValidClient++;
          else if (stateTransaction === StateName.VERIFYING)
            totalPendingClient++;
        }
      }

      for (let index = 0; index < clientBankAccounts.length; index++) {
        const stateBankAccount = await getConnection()
          .getRepository(StateBankAccount)
          .findOne({
            where: `"clientBankAccount"."idClientBankAccount" = '${clientBankAccounts[index].idClientBankAccount}' AND stateBannkAccount.finalDate is null`,
            join: {
              alias: 'stateBannkAccount',
              leftJoinAndSelect: {
                clientBankAccount: 'stateBannkAccount.clientBankAccount',
                state: 'stateBannkAccount.state',
              },
            },
          });

        if (stateBankAccount.state.name === StateName.BLOCKED)
          totalBlockedBankAccount++;
        else if (stateBankAccount.state.name === StateName.ACTIVE)
          totalActiveBankAccount++;
        else if (stateBankAccount.state.name === StateName.VERIFYING)
          totalPendingBankAccount++;
      }

      for (let index = 0; index < adminUser.length; index++) {
        const statusAdmin = await this.stateUserRepository.findOne({
          where: [
            {
              userAdministrator: adminUser[index].idUserAdministrator,
              finalDate: null,
            },
          ],
        });

        if (statusAdmin.state.name === StateName.BLOCKED) totalBlockedAdmins++;
        else if (statusAdmin.state.name === StateName.ACTIVE)
          totalActiveAdmins++;
      }

      for (let index = 0; index < clientUser.length; index++) {
        const statusClient = await this.stateUserRepository.findOne({
          where: [
            { userClient: clientUser[index].idUserClient, finalDate: null },
          ],
        });

        if (statusClient.state.name === StateName.BLOCKED)
          totalBlockedClients++;
        else if (statusClient.state.name === StateName.ACTIVE)
          totalActiveClients++;
      }

      const totalTransaccionsDeposit =
        totalInvalidDeposit + totalValidDeposit + totalPendingDeposit;
      const totalTransaccionsWithdrawal =
        totalInvalidWithdrawal + totalValidWithdrawal + totalPendingWithdrawal;
      const totalTransaccionsClient =
        totalInvalidClient + totalValidClient + totalPendingClient;
      const totalTransaccions =
        totalTransaccionsDeposit +
        totalTransaccionsWithdrawal +
        totalTransaccionsClient;

      const totalClientBankAccount =
        totalBlockedBankAccount +
        totalActiveBankAccount +
        totalPendingBankAccount;

      const totalAdmins = totalBlockedAdmins + totalActiveAdmins;
      const totalClients = totalBlockedClients + totalActiveClients;

      return {
        transactions: {
          addPoints: {
            totalInvalid: totalInvalidDeposit,
            totalValid: totalValidDeposit,
            totalPending: totalPendingDeposit,
            total: totalTransaccionsDeposit,
          },
          exchangePoints: {
            totalInvalid: totalInvalidWithdrawal,
            totalValid: totalValidWithdrawal,
            totalPending: totalPendingWithdrawal,
            total: totalTransaccionsWithdrawal,
          },
          thirdPartyClient: {
            totalInvalid: totalInvalidClient,
            totalValid: totalValidClient,
            totalPending: totalPendingClient,
            total: totalTransaccionsClient,
          },
          total: totalTransaccions,
        },
        clientBankAccounts: {
          totalInvalid: totalBlockedBankAccount,
          totalValid: totalActiveBankAccount,
          totalPending: totalPendingBankAccount,
          total: totalClientBankAccount,
        },
        users: {
          clients: {
            totalBlocked: totalBlockedClients,
            totalActive: totalActiveClients,
            totalClients: totalClients,
          },
          admins: {
            totalBlocked: totalBlockedAdmins,
            totalActive: totalActiveAdmins,
            totalAdmins: totalAdmins,
          },
        },
      };
    }
  }

  async updateSubscriptionConditions(
    idSuscription: number,
    updateSubscriptionDTO: UpdateSubscriptionDTO,
  ): Promise<UpdateResult> {
    const result = await getConnection()
      .createQueryBuilder()
      .update(Suscription)
      .set({ ...updateSubscriptionDTO })
      .where('idSuscription = :idSuscription', { idSuscription })
      .execute();

    let log;
    const amount = updateSubscriptionDTO.cost
      ? updateSubscriptionDTO.cost / 100
      : updateSubscriptionDTO.upgradedAmount / 100;
    if (updateSubscriptionDTO.cost) log = `New cost: [${amount} $]`;
    else log = `New upgraded amount: [${amount} $]`;

    this.logger.warn(
      `[${ApiModules.MANAGEMENT}] Subscription: ID = ${idSuscription}  updated | ${log}`,
    );
    return result;
  }

  async updateUserState(
    role: RoleEnum,
    state: StateName,
    id: number,
    adminId: number,
  ): Promise<StateUser> {
    const roleName = await this.roleRepository
      .createQueryBuilder('role')
      .where('role.name = :role', { role })
      .getOne();

    let user: UserClient, admin: UserAdministrator, status: StateUser;
    if (roleName.isClient()) {
      user = await this.userClientRepository.findOne({ idUserClient: id });
      status = await this.stateUserRepository.findOne({
        where: [{ userClient: user.idUserClient, finalDate: null }],
      });
    }
    if (roleName.isAdministrator()) {
      admin = await this.userAdministratorRepository.findOne({
        idUserAdministrator: id,
      });

      status = await this.stateUserRepository.findOne({
        where: [{ userAdministrator: id, finalDate: null }],
      });
    }

    await this.updateLastState(status);

    const newState = new StateUser();
    newState.initialDate = new Date();
    newState.state = await this.getState(state);
    if (roleName.isClient()) {
      newState.userClient = user;
    } else if (roleName.isAdministrator()) {
      newState.userAdministrator = admin;
    }

    return await this.stateUserRepository.save(newState);
  }

  async updateLastState(state: StateUser): Promise<StateUser> {
    state.finalDate = new Date();
    return await this.stateUserRepository.save(state);
  }
}
