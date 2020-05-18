import { Module } from '@nestjs/common';

// MODULES
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';

// CONTROLLER
import { ExampleController } from './example.controller';

// SERVICES
import { ExampleService } from './example.service';

@Module({
  imports: [AuthModule, UserModule],
  controllers: [ExampleController],
  providers: [ExampleService],
})
export class ExampleModule {}
