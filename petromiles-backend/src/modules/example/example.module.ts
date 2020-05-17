import { Module } from '@nestjs/common';
import { ExampleController } from './example.controller';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { JwtStrategy } from '../auth/jwt.strategy';
import { ExampleService } from './example.service';

@Module({
  imports: [AuthModule, UserModule, ConfigModule],
  controllers: [ExampleController],
  providers: [JwtStrategy, ExampleService],
})
export class ExampleModule {}
