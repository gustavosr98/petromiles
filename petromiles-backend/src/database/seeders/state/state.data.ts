/* eslint-disable @typescript-eslint/camelcase */
import { State } from '../../../modules/management/state/state.entity';

export const STATES = [
  {
    id_state: 1,
    name: 'ACTIVE',
    description: 'This state indicates that the object is ready to be used',
  },

  {
    id_state: 2,
    name: 'VERIFYING',
    description:
      'This state indicates that the object is in the verification process',
  },
  {
    id_state: 3,
    name: 'BLOCKED',
    description: 'This state indicates that the object has been disabled',
  },

  {
    id_state: 4,
    name: 'CANCELED',
    description: 'This state indicates that the object cant be used',
  },

  {
    id_state: 5,
    name: 'VALID',
    description:
      'This state indicates that the transaction has been made successful',
  },
  {
    id_state: 6,
    name: 'INVALID',
    description:
      'This state indicates that the transaction has not been made successful',
  },
];
