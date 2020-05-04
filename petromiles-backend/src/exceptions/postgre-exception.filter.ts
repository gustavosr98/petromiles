import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { ERROR } from './error-messages';

@Catch(QueryFailedError)
export class PostgreExceptionFilter implements ExceptionFilter {
  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    Logger.error(`[${exception.name}] ${exception.message}`);

    if (exception.message.includes('«FK')) {
      response.status(ERROR.DATABASE_FK.statusCode).json(ERROR.DATABASE_FK);
    } else if (exception.message.includes('«check»')) {
      response
        .status(ERROR.DATABASE_CHECK.statusCode)
        .json(ERROR.DATABASE_CHECK);
    } else {
      response.status(ERROR.DATABASE.statusCode).json(ERROR.DATABASE);
    }
  }
}
