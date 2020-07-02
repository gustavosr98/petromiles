import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

import { Repository, getConnection } from 'typeorm';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

// CONSTANTS
import { MailsSubjets } from '@/constants/mailsSubjectConst';

// SERVICES
import { BankAccountService } from '@/modules/bank-account/services/bank-account.service';
import { UserClientService } from '@/modules/user/services/user-client.service';
import { TransactionService } from '@/modules/transaction/services/transaction.service';
import { StateTransactionService } from '@/modules/transaction/services/state-transaction.service';
import { PaymentProviderService } from '@/modules/payment-provider/payment-provider.service';
import { ManagementService } from '@/modules/management/services/management.service';
import { MailsService } from '@/modules/mails/mails.service';

// ENTITIES
import { ClientBankAccount } from '@/entities/client-bank-account.entity';
import { StateBankAccount } from '@/entities/state-bank-account.entity';
import { BankAccount } from '@/entities/bank-account.entity';

// INTERFACES
import { PaymentProvider } from '@/enums/payment-provider.enum';
import { ApiModules } from '@/logger/api-modules.enum';
import { StateName, StateDescription } from '@/enums/state.enum';
import { TransactionType } from '@/enums/transaction.enum';
import { CreateBankAccountDTO } from '@/modules/bank-account/dto/create-bank-account.dto';
import { updatePrimaryAccountDTO } from '@/modules/bank-account/dto/update-primary-account.dto';
import { UpdateAccountStateDto } from '@/modules/bank-account/dto/update-account-state.dto';

@Injectable()
export class ClientBankAccountService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private bankAccountService: BankAccountService,
    @InjectRepository(ClientBankAccount)
    private clientBankAccountRepository: Repository<ClientBankAccount>,
    @InjectRepository(BankAccount)
    private bankAccountRepository: Repository<BankAccount>,
    @InjectRepository(StateBankAccount)
    private stateBankAccountRepository: Repository<StateBankAccount>,
    private stateTransactionService: StateTransactionService,
    private userClientService: UserClientService,
    private transactionService: TransactionService,
    private paymentProviderService: PaymentProviderService,
    private managementService: ManagementService,
    private mailsService: MailsService,
    private configService: ConfigService,
  ) {}

  async create(
    bankAccountCreateParams: CreateBankAccountDTO,
    user,
  ): Promise<ClientBankAccount> {
    if (await this.nicknameIsTaken(bankAccountCreateParams.nickname, user.id))
      throw new BadRequestException('error-messages.invalidNickname');

    const userClient = await this.userClientService.get({ email: user.email });

    const bankAccount = await this.bankAccountService.create(
      bankAccountCreateParams,
    );

    const paymentProviderBankAccount = await this.paymentProviderService.createBankAccount(
      userClient,
      bankAccountCreateParams,
    );

    const clientBankAccount = await this.clientBankAccountRepository
      .create({
        bankAccount,
        userClient,
        transferId: paymentProviderBankAccount.transferId,
        chargeId: paymentProviderBankAccount.chargeId,
        paymentProvider: PaymentProvider.STRIPE,
      })
      .save();

    await this.changeState(
      StateName.VERIFYING,
      clientBankAccount,
      StateDescription.NEWLY_CREATED_ACCOUNT,
    );

    await this.transactionService.createVerificationTransaction(
      clientBankAccount,
    );

    this.logger.verbose(
      `[${ApiModules.BANK_ACCOUNT}] {${user.email}} Bank account successfully created`,
    );

    return clientBankAccount;
  }

  async getClientBankAccounts(idUserClient: number): Promise<BankAccount[]> {
    return await getConnection()
      .getRepository(BankAccount)
      .find({
        where: `"userClient"."idUserClient" ='${idUserClient}' and "stateBankAccount"."finalDate" is null and state.name != '${StateName.CANCELLED}'`,
        join: {
          alias: 'bankAccount',
          innerJoinAndSelect: {
            clientBankAccount: 'bankAccount.clientBankAccount',
            stateBankAccount: 'clientBankAccount.stateBankAccount',
            userClient: 'clientBankAccount.userClient',
            state: 'stateBankAccount.state',
            routingNumber: 'bankAccount.routingNumber',
            bank: 'routingNumber.bank',
          },
        },
      });
  }

  async getOne(
    idUserClient: number,
    idBankAccount: number,
  ): Promise<ClientBankAccount> {
    const bankAccount = await this.clientBankAccountRepository.findOneOrFail({
      where: `userClient.idUserClient = ${idUserClient} AND bankAccount.idBankAccount = ${idBankAccount}`,
      join: {
        alias: 'clientBankAccount',
        innerJoin: {
          bankAccount: 'clientBankAccount.bankAccount',
          userClient: 'clientBankAccount.userClient',
        },
      },
    });
    return bankAccount;
  }

  async getByState(
    states: StateName[],
  ): Promise<
    (ClientBankAccount & {
      email: string;
      customerId: string;
      idStateBankAccount: number;
    })[]
  > {
    const bankAccounts = await getConnection().query(
      `
      SELECT
        CLIENT_BANK_ACCOUNT.*, USER_CLIENT.email, USER_DETAILS."customerId",  STATE_BANK_ACCOUNT."idStateBankAccount"
      FROM 
        CLIENT_BANK_ACCOUNT,
        USER_CLIENT,
        USER_DETAILS, 
        STATE_USER,
        STATE_BANK_ACCOUNT,
        STATE STATE_BA,
        STATE STATE_U
      WHERE
        -- Relations
        CLIENT_BANK_ACCOUNT.fk_user_client = USER_CLIENT."idUserClient"
        AND STATE_BANK_ACCOUNT.fk_client_bank_account = CLIENT_BANK_ACCOUNT."idClientBankAccount"
        AND STATE_BANK_ACCOUNT.fk_state = STATE_BA."idState"
        AND STATE_USER.fk_user_client = USER_CLIENT."idUserClient"
        AND STATE_USER.fk_state = STATE_U."idState" 
        AND USER_DETAILS.fk_user_client = USER_CLIENT."idUserClient"
        -- Conditions
        AND STATE_BANK_ACCOUNT."finalDate" IS NULL
        AND STATE_U.name = 'active'
        AND STATE_BA.name = ANY($1)    
    `,
      [states],
    );
    return bankAccounts;
  }

  async verify(verificationRequest: {
    clientBankAccountId: number;
    amounts: number[];
  }): Promise<App.Auth.ResponseStripe> {
    const clientBankAccount = await this.clientBankAccountRepository.findOne({
      idClientBankAccount: verificationRequest.clientBankAccountId,
    });

    if (
      !(await this.checkVerificationAmounts(
        clientBankAccount,
        verificationRequest.amounts,
      ))
    ) {
      const message = `[${ApiModules.BANK_ACCOUNT}] Invalid verification amounts for the client bank account ID ${clientBankAccount.idClientBankAccount}`;
      this.logger.error(message);
      throw new BadRequestException('error-messages.invalidVerification');
    }

    const verification = await this.paymentProviderService.verifyBankAccount({
      customerId: clientBankAccount.userClient.userDetails.customerId,
      bankAccountId: clientBankAccount.chargeId,
      amounts: verificationRequest.amounts,
    });

    await this.changeState(
      StateName.ACTIVE,
      clientBankAccount,
      StateDescription.BANK_ACCOUNT_VALIDATION,
    );

    const verificationTransactions = await this.transactionService.getAllFiltered(
      [StateName.VERIFYING],
      [TransactionType.BANK_ACCOUNT_VALIDATION],
      [PaymentProvider.STRIPE],
      clientBankAccount.idClientBankAccount,
      true,
    );

    await this.stateTransactionService.update(
      StateName.VALID,
      verificationTransactions[0],
      StateDescription.CHANGE_VERIFICATION_TO_VALID,
    );
    await this.stateTransactionService.update(
      StateName.VALID,
      verificationTransactions[1],
      StateDescription.CHANGE_VERIFICATION_TO_VALID,
    );

    return {
      object: verification.object,
      account_holder_name: verification.account_holder_name,
      bank_name: verification.bank_name,
      country: verification.country,
      currency: verification.currency,
      accountNumber_last4: verification.last4,
      metadata: verification.metadata,
      status: verification.status,
    };
  }

  async checkVerificationAmounts(clientBankAccount, amounts) {
    const transactions = await this.transactionService.getClientBankAccountTransaction(
      clientBankAccount,
    );
    let correctValues = true;

    transactions.forEach(transaction => {
      if (!amounts.includes(transaction.totalAmountWithInterest / 100)) {
        correctValues = false;
      }
    });

    return correctValues;
  }

  async updateState(
    idClientBankAccount: number,
    state: StateName,
    description?: string,
  ): Promise<StateBankAccount> {
    const clientBankAccount: ClientBankAccount = await this.clientBankAccountRepository.findOne(
      {
        idClientBankAccount,
      },
    );

    return await this.changeState(state, clientBankAccount, description);
  }

  async changeState(
    stateName: StateName,
    clientBankAccount: ClientBankAccount,
    description?,
  ) {
    if (clientBankAccount.stateBankAccount)
      await this.endLastState(clientBankAccount);

    const stateBankAccount = new StateBankAccount();
    stateBankAccount.clientBankAccount = clientBankAccount;
    stateBankAccount.description = description;
    stateBankAccount.state = await this.managementService.getState(stateName);

    this.logger.silly(
      `[${ApiModules.BANK_ACCOUNT}] ID: ${clientBankAccount.idClientBankAccount} updated to state: (${stateName})`,
    );

    await this.sendStatusBankAccount(stateName, clientBankAccount);

    return await getConnection()
      .getRepository(StateBankAccount)
      .save(stateBankAccount);
  }

  sendStatusBankAccount(
    bankAccountStatus: StateName,
    clientBankAccount: ClientBankAccount,
  ) {
    const lastNumbersBankAccount = 4;
    const languageMails =
      clientBankAccount.userClient.userDetails.language.name;
    const bank = clientBankAccount.bankAccount.routingNumber.bank.name;

    if (bankAccountStatus === StateName.VERIFYING) {
      const template = `bankAccountRegistration[${languageMails}]`;

      const subject = MailsSubjets.bank_account_registration[languageMails];

      const msg = {
        to: clientBankAccount.userClient.email,
        subject: subject,
        templateId: this.configService.get<string>(
          `mails.sendgrid.templates.${template}`,
        ),
        dynamic_template_data: {
          user: clientBankAccount.userClient.userDetails.firstName,
          bank,
          accountHolderName:
            clientBankAccount.bankAccount.userDetails.firstName +
            ' ' +
            clientBankAccount.bankAccount.userDetails.lastName,
          accountNumber: clientBankAccount.bankAccount.accountNumber.slice(
            -lastNumbersBankAccount,
          ),
        },
      };
      this.mailsService.sendEmail(msg);
    } else if (bankAccountStatus === StateName.ACTIVE) {
      const template = `bankAccountVerified[${languageMails}]`;

      const subject = MailsSubjets.bank_account_verified[languageMails];

      const msg = {
        to: clientBankAccount.userClient.email,
        subject: subject,
        templateId: this.configService.get<string>(
          `mails.sendgrid.templates.${template}`,
        ),
        dynamic_template_data: {
          user: clientBankAccount.userClient.userDetails.firstName,
          bank,
          accountNumber: clientBankAccount.bankAccount.accountNumber.slice(
            -lastNumbersBankAccount,
          ),
        },
      };
      this.mailsService.sendEmail(msg);
    } else if (bankAccountStatus === StateName.CANCELLED) {
      const template = `bankAccountDeletion[${languageMails}]`;

      const subject = MailsSubjets.bank_account_deletion[languageMails];

      const msg = {
        to: clientBankAccount.userClient.email,
        subject: subject,
        templateId: this.configService.get<string>(
          `mails.sendgrid.templates.${template}`,
        ),
        dynamic_template_data: {
          user: clientBankAccount.userClient.userDetails.firstName,
          accountNumber: clientBankAccount.bankAccount.accountNumber.slice(
            -lastNumbersBankAccount,
          ),
        },
      };
      this.mailsService.sendEmail(msg);
    }
  }

  private async endLastState(clientBankAccount: ClientBankAccount) {
    let currentStateBankAccount = await this.stateBankAccountRepository.findOne(
      {
        clientBankAccount,
        finalDate: null,
      },
    );

    currentStateBankAccount.finalDate = new Date();
    await this.stateBankAccountRepository.save(currentStateBankAccount);
  }

  async cancelBankAccount(idUserClient, idBankAccount, email) {
    const clientBankAccount = await this.getOne(idUserClient, idBankAccount);

    const hasPendingTransaction = await this.hasPendingTransaction(
      clientBankAccount,
    );
    if (hasPendingTransaction) {
      this.logger.error(
        `[${ApiModules.BANK_ACCOUNT}] Bank Account ID: ${clientBankAccount.idClientBankAccount} cannot be deleted yet`,
      );
      throw new BadRequestException('error-messages.pendingTransactions');
    }

    await this.changeState(
      StateName.CANCELLED,
      clientBankAccount,
      StateDescription.BANK_ACCOUNT_CANCELLED,
    );

    const customerId = clientBankAccount.userClient.userDetails.customerId;
    await this.paymentProviderService.deleteBankAccount(
      customerId,
      clientBankAccount.chargeId,
      email,
    );

    this.logger.silly(
      `[${ApiModules.BANK_ACCOUNT}] Bank Account ID: ${clientBankAccount.idClientBankAccount} was deleted`,
    );
  }

  private async hasPendingTransaction(
    clientBankAccount: ClientBankAccount,
  ): Promise<boolean> {
    const pendingValidations = await this.transactionService.getAllFiltered(
      [StateName.VERIFYING],
      [TransactionType.BANK_ACCOUNT_VALIDATION],
      [PaymentProvider.STRIPE],
      clientBankAccount.idClientBankAccount,
      true,
    );

    if (pendingValidations.length > 0) return true;

    const pendingTransactions = await this.transactionService.getAllFiltered(
      [StateName.VERIFYING],
      [
        TransactionType.DEPOSIT,
        TransactionType.WITHDRAWAL,
        TransactionType.SUSCRIPTION_PAYMENT,
      ],
      [PaymentProvider.STRIPE],
      clientBankAccount.idClientBankAccount,
    );

    if (pendingTransactions.length > 0) return true;

    return false;
  }
  private async nicknameIsTaken(
    nickname: string,
    idUserClient: number,
  ): Promise<Boolean> {
    const bankAccounts = await this.getClientBankAccounts(idUserClient);
    const accountWithNickname = bankAccounts.find(
      bankAccount =>
        bankAccount.nickname.toLowerCase() == nickname.toLowerCase(),
    );

    if (accountWithNickname !== undefined) return true;
    return false;
  }

  async updateCurrentPrimary(
    updatePrimaryAccountDTO: updatePrimaryAccountDTO,
    idUserClient: number,
  ): Promise<ClientBankAccount> {
    const { primary, idBankAccount } = updatePrimaryAccountDTO;

    // Set primary=false to the current primary bank account
    if (primary) {
      const clientBankAccount = await this.clientBankAccountRepository.findOne({
        userClient: await this.userClientService.get({ idUserClient }),
        primary: true,
      });

      if (clientBankAccount) await this.updatePrimary(clientBankAccount, false);
    }

    const clientBankAccount = await this.clientBankAccountRepository.findOne({
      bankAccount: await this.bankAccountRepository.findOne({ idBankAccount }),
    });

    return await this.updatePrimary(clientBankAccount, primary);
  }

  async updatePrimary(
    clientBankAccount: ClientBankAccount,
    primary: boolean,
  ): Promise<ClientBankAccount> {
    clientBankAccount.primary = primary;
    return await this.clientBankAccountRepository.save(clientBankAccount);
  }

  async updateAccountState(updateAccountStateDto: UpdateAccountStateDto) {
    const clientBankAccount = await this.getOne(
      updateAccountStateDto.idUserClient,
      updateAccountStateDto.idBankAccount,
    );

    const hasPendingTransaction = await this.hasPendingTransaction(
      clientBankAccount,
    );
    if (hasPendingTransaction) {
      this.logger.error(
        `[${ApiModules.BANK_ACCOUNT}] Bank Account ID: ${clientBankAccount.idClientBankAccount} state cannot be changed`,
      );
      throw new BadRequestException('error-messages.pendingTransactions');
    }
    let description;
    if (updateAccountStateDto.state === StateName.BLOCKED) {
      description = StateDescription.BANK_ACCOUNT_BLOCKED;
    } else if (updateAccountStateDto.state === StateName.ACTIVE) {
      description = StateDescription.BANK_ACCOUNT_ACTIVATED;
    }

    await this.changeState(
      updateAccountStateDto.state,
      clientBankAccount,
      description,
    );
  }
}
