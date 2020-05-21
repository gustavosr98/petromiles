import { Module } from '@nestjs/common';

// MODULES
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { ManagementModule } from '../management/management.module';

// CONTROLLER
import { AuthController } from './auth.controller';
import { MailsModule } from '../mails/mails.module';
import { UserModule } from '../user/user.module';

// SERVICES
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { SuscriptionModule } from '../suscription/suscription.module';

@Module({
  imports: [
    MailsModule,
    UserModule,
    ManagementModule,
    PassportModule,
    ConfigModule,
    SuscriptionModule,
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
  exports: [PassportModule],
})
export class AuthModule {}
