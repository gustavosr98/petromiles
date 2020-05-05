/* eslint-disable @typescript-eslint/camelcase */
import { State } from '../../../modules/management/state/state.entity';

export const STATES = [
  {
    idState: 1,
    name: 'ACTIVE',
    description: 'This state indicates that the object is ready to be used',
  },

  {
    idState: 2,
    name: 'VERIFYING',
    description:
      'This state indicates that the object is in the verification process',
  },
  {
    idState: 3,
    name: 'BLOCKED',
    description: 'This state indicates that the object has been disabled',
  },

  {
    idState: 4,
    name: 'CANCELED',
    description: 'This state indicates that the object cant be used',
  },

  {
    idState: 5,
    name: 'VALID',
    description:
      'This state indicates that the transaction has been made successful',
  },
  {
    idState: 6,
    name: 'INVALID',
    description:
      'This state indicates that the transaction has not been made successful',
  },
];
