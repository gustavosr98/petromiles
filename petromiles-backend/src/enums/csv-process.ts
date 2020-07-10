export enum CsvProcessResult {
  VALID = 'VALID',
  MAINTAIN = 'MAINTAIN',
  INVALID = 'INVALID',
}

export enum CsvProcessDescription {
  ALREADY_VALID = 'already_valid',
  ALREADY_INVALID = 'already_invalid',
  NOT_EXISTING_TRANSACTION_ID = 'not_existing_transaction_id',
  WRONG_TYPE_OF_VALUES = 'wrong_type_of_values',
  NO_MATCH_DATE = 'no_match_date',
  NO_MATCH_USER_EMAIL = 'no_match_user_email',
  NO_MATCH_POINTS_TO_DOLLARS = 'no_match_points_to_dollars',
  NO_MATCH_COMMISSION = 'no_match_commission',
  NO_MATCH_ACCUMULATED_POINTS = 'no_match_accumulated_points',
}

export enum CsvApiError {
  APIKEY_INCONSISTENCY = 'apikey_inconsistency',
  REPEATED_TRANSACTION_IDS = 'repeated_transaction_ids',
  CSV_NO_FILE_FOUND = 'csv_no_file_found',
  CSV_WRONG_FORMAT = 'csv_wrong_format',
}
