import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
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
    const { email } = payload;
    const user = await this.userService.getUserByEmail(email);
    if (!user)
      throw new UnauthorizedException(`User does not have authorization`);

    return {
      email: user.user.email,
      id: user.userDetails.fk_user_client,
      role: user.u_role,
    };
  }
}
