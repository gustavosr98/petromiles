import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { SeederModule } from './database/seeders/seeder.module';
import { Seeder } from './database/seeders/seeder';

async function bootstrap() {
  NestFactory.createApplicationContext(SeederModule).then(appContext => {
    const logger = appContext.get(Logger);
    const seeder = appContext.get(Seeder);

    seeder
      .clean()
      .then(() => {
        logger.debug('Cleaning database complete!');
      })
      .catch(error => {
        logger.error('Cleaning database failed!');
        throw error;
      })
      .finally(() => appContext.close());
  });
}
bootstrap();
