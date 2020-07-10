import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import * as bcrypt from 'bcrypt';

export interface Response<T> {
  data: T;
}

@Injectable()
export class PasswordEncryptorInterceptor<T>
  implements NestInterceptor<T, Response<T>> {
  constructor() {}
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<Response<T>>> {
    const req = context.switchToHttp().getRequest();

    // Encrypts password only for federated sign up
    if (req.body.password !== undefined) {
      const salt = await bcrypt.genSalt();
      const password = req.body.password;

      req.body.password = await bcrypt.hash(password, salt);
      req.body.salt = salt;
    }
    return next.handle().pipe();
  }
}
