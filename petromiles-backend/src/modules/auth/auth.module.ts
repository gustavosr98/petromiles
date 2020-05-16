import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';

import { JwtStrategy } from './jwt.strategy';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ClientModule } from '../client/client.module';
import { MailsModule } from '../mails/mails.module';
import { PlatformAdministratorModule } from '../management/platform-administrator.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    ClientModule,
    MailsModule,
    UserModule,
    PlatformAdministratorModule,
    PassportModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('jwt.secret'),
        signOptions: {
          expiresIn: config.get<string>('jwt.expiresIn'),
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
