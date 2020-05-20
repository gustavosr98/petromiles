export interface ErrorCollection {
  [key: string]: ErrorContent;
}

export interface ErrorContent {
  statusCode: number;
  message: string;
}
