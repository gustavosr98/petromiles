import { Module, HttpModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

// CONTROLLER
import { LanguageController } from './language.controller';

// SERVICES
import { LanguageService } from './language.service';
import { PoeditorService } from './poeditor/poeditor.service';

@Module({
  imports: [ConfigModule, HttpModule],
  controllers: [LanguageController],
  providers: [LanguageService, PoeditorService],
})
export class LanguageModule {}
