import { ViewEntity, ViewColumn, Connection, Brackets } from 'typeorm';
import { Transform } from 'class-transformer';

import { Transaction } from './transaction.entity';
import { TransactionType } from '@/enums/transaction.enum';
import { StateName } from '@/enums/state.enum';

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
      .leftJoin('transaction.clientBankAccount', 'clientBankAccount')
      .leftJoin('clientBankAccount.userClient', 'userClient')
      .leftJoin('transaction.stateTransaction', 'stateTransaction')
      .leftJoin('stateTransaction.state', 'state')
      .leftJoin('transaction.pointsConversion', 'pointsConversion')
      .where(`state.name = '${StateName.VALID}'`)
      .andWhere(
        new Brackets(type => {
          type
            .where(`transaction.type = '${TransactionType.DEPOSIT}'`)
            .orWhere(`transaction.type = '${TransactionType.WITHDRAWAL}'`);
        }),
      )
      .groupBy('userClient.email'),
})
export class ClientPoints {
  @Transform(dollars => parseFloat(dollars).toFixed(2))
  @ViewColumn()
  dollars: number;

  @Transform(points => parseFloat(points).toFixed(2))
  @ViewColumn()
  points: number;

  @ViewColumn()
  email: string;
}
