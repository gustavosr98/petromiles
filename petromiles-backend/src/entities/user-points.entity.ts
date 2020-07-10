import { ViewEntity, ViewColumn, Connection, Brackets } from 'typeorm';
import { Transform } from 'class-transformer';

import { Transaction } from './transaction.entity';
import { TransactionType } from '@/enums/transaction.enum';
import { StateName } from '@/enums/state.enum';
import { UserClient } from './user-client.entity';

@ViewEntity({
  expression: (connection: Connection) =>
    connection
      .createQueryBuilder()
      .select(
        'SUM(transaction.rawAmount * transaction.operation) /100',
        'dollars',
      )
      .addSelect(
        'SUM((transaction.rawAmount * transaction.operation)/ pointsConversion.onePointEqualsDollars)/100',
        'points',
      )
      .addSelect('userClient.email', 'email')
      .from(Transaction, 'transaction')
      .leftJoin('transaction.clientOnThirdParty', 'clientOnThirdParty')
      .leftJoin('transaction.clientBankAccount', 'clientBankAccount')
      .leftJoin(
        UserClient,
        'userClient',
        '"userClient"."idUserClient" = "clientBankAccount".fk_user_client OR "userClient"."idUserClient" = "clientOnThirdParty".fk_user_client',
      )
      .leftJoin('transaction.stateTransaction', 'stateTransaction')
      .leftJoin('stateTransaction.state', 'state')
      .leftJoin('transaction.pointsConversion', 'pointsConversion')
      .where(`state.name = '${StateName.VALID}'`)
      .andWhere(
        new Brackets(type => {
          type
            .where(`transaction.type = '${TransactionType.DEPOSIT}'`)
            .orWhere(`transaction.type = '${TransactionType.WITHDRAWAL}'`)
            .orWhere(
              `transaction.type = '${TransactionType.THIRD_PARTY_CLIENT}'`,
            );
        }),
      )
      .groupBy('userClient.email'),
})
export class ClientPoints {
  constructor() {}
  @Transform(dollars => Math.round(parseFloat(dollars) * 10000) / 10000)
  @ViewColumn()
  dollars: number;

  @Transform(points => Math.round(parseFloat(points)))
  @ViewColumn()
  points: number;

  @ViewColumn()
  email: string;
}
