import { Module } from '@nestjs/common';
import { UserClientService } from './user-client/user-client.service';
import { UserClient } from './user-client/user-client.entity';
import { UserModule } from '../user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([UserClient])],
  providers: [UserClientService],
  exports: [UserClientService, TypeOrmModule.forFeature([UserClient])],
})
export class ClientModule {}
