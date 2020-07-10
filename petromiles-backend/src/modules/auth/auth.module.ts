import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';

// MODULES
import { ManagementModule } from '@/modules/management/management.module';
import { MailsModule } from '@/modules/mails/mails.module';
import { UserModule } from '@/modules/user/user.module';
import { SuscriptionModule } from '@/modules/suscription/suscription.module';

// CONTROLLER
import { AuthController } from '@/modules/auth/auth.controller';

// SERVICES
import { AuthService } from '@/modules/auth/auth.service';

import { JwtStrategy } from '@/modules/auth/jwt.strategy';

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
  exports: [PassportModule, AuthService],
})
export class AuthModule {}
