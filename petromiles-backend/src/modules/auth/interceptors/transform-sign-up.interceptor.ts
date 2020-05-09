import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Inject,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import * as bcrypt from 'bcrypt';
import { AuthService } from '../auth.service';

export interface Response<T> {
  data: T;
}

@Injectable()
export class TransformSignUpInterceptor<T>
  implements NestInterceptor<T, Response<T>> {
  constructor(@Inject(AuthService) private authService: AuthService) {}
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<Response<T>>> {
    const req = context.switchToHttp().getRequest();

    // 1) Se verifica que haya una contraseña en el request
    if (req.body.password !== undefined) {
      // 2) Se encripta la contraseña
      const salt = await bcrypt.genSalt();
      const password = req.body.password;
      req.body.password = await this.authService.hashPassword(password, salt);
      req.body.salt = salt;
    }
    return next.handle().pipe();
  }
}
