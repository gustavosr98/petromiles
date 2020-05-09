import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { ERROR } from './error-messages';

@Catch(QueryFailedError)
export class PostgreExceptionFilter implements ExceptionFilter {
  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    if (exception.message.includes('llave duplicada')) {
      response.status(ERROR.USER_EXISTS.statusCode).json(ERROR.USER_EXISTS);
    }
  }
}
