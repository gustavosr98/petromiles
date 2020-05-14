import { Module } from '@nestjs/common';
import { ExampleController } from './example.controller';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { JwtStrategy } from '../auth/jwt.strategy';

@Module({
  imports: [AuthModule, UserModule, ConfigModule],
  controllers: [ExampleController],
  providers: [JwtStrategy],
})
export class ExampleModule {}
