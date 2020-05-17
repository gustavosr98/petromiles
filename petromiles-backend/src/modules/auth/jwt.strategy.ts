import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';

import { Strategy, ExtractJwt } from 'passport-jwt';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

import { UserService } from '../user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private configService: ConfigService,
    private userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('jwt.secret'),
    });
  }

  async validate(payload: App.Auth.JWTPayload) {
    const user = await this.userService.getUserByEmail(payload);
    if (!user) {
      this.logger.error(
        `[AUTH] The user ${payload.email} does not have authorization. Log in again`,
      );
      throw new UnauthorizedException(`User does not have authorization`);
    }

    return {
      email: payload.email,
      id: user.userDetails.fk_user_client,
      role: payload.role,
    };
  }
}