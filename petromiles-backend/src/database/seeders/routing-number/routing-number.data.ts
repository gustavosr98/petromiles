import allyBank from '@/database/seeders/routing-number/banks-ach/ally-bank';
import bankOfAmerica from '@/database/seeders/routing-number/banks-ach/bank-of-america';
import bbtBank from '@/database/seeders/routing-number/banks-ach/bbt-bank';
import bbvaCompass from '@/database/seeders/routing-number/banks-ach/bbva-compass';
import capitalOneBank from '@/database/seeders/routing-number/banks-ach/capital-one-bank';
import citiBank from '@/database/seeders/routing-number/banks-ach/citibank';
import citizensBank from '@/database/seeders/routing-number/banks-ach/citiznes-bank';
import fifthThirdBank from '@/database/seeders/routing-number/banks-ach/fifth-third-bank';
import jpMorganChaseBank from '@/database/seeders/routing-number/banks-ach/jp-morgan-chase-bank';
import keyBank from '@/database/seeders/routing-number/banks-ach/key-bank';
import kineticCreditUnion from '@/database/seeders/routing-number/banks-ach/kinetic-credit-union';
import navyFederalCreditUnion from '@/database/seeders/routing-number/banks-ach/navy-federal-credit-union';
import pncBank from '@/database/seeders/routing-number/banks-ach/pnc-bank';
import regionsBank from '@/database/seeders/routing-number/banks-ach/regions-bank';
import suntrustBank from '@/database/seeders/routing-number/banks-ach/suntrust-bank';
import tdBank from '@/database/seeders/routing-number/banks-ach/td-bank';
import usBank from '@/database/seeders/routing-number/banks-ach/us-bank';
import usaa from '@/database/seeders/routing-number/banks-ach/usaa';
import wellsFargoBank from '@/database/seeders/routing-number/banks-ach/wells-fargo-bank';

const banks = [
  allyBank,
  bankOfAmerica,
  bbtBank,
  bbvaCompass,
  capitalOneBank,
  citiBank,
  citizensBank,
  fifthThirdBank,
  jpMorganChaseBank,
  keyBank,
  kineticCreditUnion,
  navyFederalCreditUnion,
  pncBank,
  regionsBank,
  suntrustBank,
  tdBank,
  usBank,
  usaa,
  wellsFargoBank,
];

const createRoutingNumbers = (bankName: string, routingNumbers: string[]) => {
  return routingNumbers.map(routingNumber => ({
    number: routingNumber,
    bankName,
  }));
};

let routingNumbers = [];

banks.forEach(
  bank =>
    (routingNumbers = [
      ...routingNumbers,
      ...createRoutingNumbers(bank.bankName, bank.achs),
    ]),
);

export { routingNumbers };
