import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { PostgreExceptionFilter } from './exceptions/postgre-exception.filter';
import * as helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get('port');

  const options = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
    ],
  };

  app.enableCors(options);
  app.use(helmet());
  app.setGlobalPrefix('/api/v1');

  app.useGlobalFilters(new PostgreExceptionFilter());

  await app.listen(port, () => console.log(`Server is running on ${port}`));
}
bootstrap();
