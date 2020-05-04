import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';

export const dataBaseProvider = TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  async useFactory(configService: ConfigService) {
    const db = configService.get('database');
    return {
      type: db.type,
      host: process.env.DATABASE_HOST || db.host,
      port: process.env.DATABASE_PORT || db.port,
      username: process.env.DATABASE_USER || db.user,
      password: process.env.DATABASE_PASSWORD || db.password,
      database: process.env.DATABASE_NAME || db.database,
      entities: [__dirname + '/../**/*.entity.{js,ts}'],
      migrations: [__dirname + '/migrations/*{.ts,.js'],
      synchronize: process.env.DATABASE_SYNCHRONIZE || db.synchronize,
    };
  },
});
