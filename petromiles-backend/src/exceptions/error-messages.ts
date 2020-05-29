import { ErrorCollection, ErrorContent } from './error-messages.interface';

export const ERROR = Object.freeze<ErrorCollection>({
  DATABASE: Object.freeze<ErrorContent>({
    statusCode: 500,
    message: 'Internal Server Error: Problem with the database',
  }),
  USER_EXISTS: Object.freeze<ErrorContent>({
    statusCode: 400,
    message: 'Bad Request: Email already in use',
  }),
  STRIPE: Object.freeze<ErrorContent>({
    statusCode: 500,
    message: 'error-messages.errorStripe',
  }),
});
