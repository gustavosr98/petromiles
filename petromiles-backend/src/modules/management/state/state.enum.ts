export enum StateName {
  VERIFYING = 'verifying',
  ACTIVE = 'active',
  BLOCKED = 'blocked',
  CANCELLED = 'cancelled',
  VALID = 'valid',
  INVALID = 'invalid',
}

export enum StateType {
  USER = 'USER',
  TRANSACTION = 'TRANSACTION',
  BANK_ACCOUNT = 'BANK_ACCOUNT',
}

export enum StateDescription {
  NEWLY_CREATED_ACCOUNT = 'NEWLY_CREATED_ACCOUNT',
  VERIFICATION_TRANSACTION_CREATION = 'VERIFICATION_TRANSACTION_CREATION',
  SUSCRIPTION_UPGRADE = 'SUSCRIPTION_UPGRADE',
}
