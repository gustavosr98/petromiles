/* eslint-disable @typescript-eslint/camelcase */
import { StateName } from '../../../enums/state.enum';

export const STATES = [
  {
    idState: 1,
    name: StateName.ACTIVE,
    description: 'This state indicates that the object is ready to be used',
  },

  {
    idState: 2,
    name: StateName.VERIFYING,
    description:
      'This state indicates that the object is in the verification process',
  },
  {
    idState: 3,
    name: StateName.BLOCKED,
    description: 'This state indicates that the object has been disabled',
  },

  {
    idState: 4,
    name: StateName.CANCELLED,
    description: 'This state indicates that the object cannot be used',
  },

  {
    idState: 5,
    name: StateName.VALID,
    description:
      'This state indicates that the transaction has been made successful',
  },
  {
    idState: 6,
    name: StateName.INVALID,
    description:
      'This state indicates that the transaction has not been made successful',
  },
];
