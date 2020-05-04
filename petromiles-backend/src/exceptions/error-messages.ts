import { ErrorCollection, ErrorContent } from './error-messages.interface';

export const ERROR = Object.freeze<ErrorCollection>({
  DATABASE: Object.freeze<ErrorContent>({
    statusCode: 500,
    message: 'Internal Server Error: Problem with the database'
  }),
  DATABASE_FK: Object.freeze<ErrorContent>({
    statusCode: 400,
    message: 'Bad Request: Invalid payload content | DATABASE_FK '
  }),
  DATABASE_CHECK: Object.freeze<ErrorContent>({
    statusCode: 400,
    message: 'Bad Request: Invalid payload content | DATABASE_CHECK'
  })
});
