import * as winston from 'winston';
import { consoleFormat, fileFormat } from './loggerCommonFormat';
import { WinstonOptions } from './WinstonConfig.interface';
import { Injectable } from '@nestjs/common';
import * as fs from 'fs';

@Injectable()
export class LoggerOptions implements WinstonOptions {
  createOptions(directory: string) {
    this.createDir(`${__dirname}/../../../logs`);
    const options = {
      transports: [
        new winston.transports.Console({
          level: 'debug',
          format: consoleFormat,
        }),
        new winston.transports.File({
          level: 'debug',
          format: fileFormat,
          maxsize: 5120000,
          maxFiles: 5,
          filename: `${__dirname}/../../../logs/${directory}`,
        }),
      ],
    };

    return options;
  }

  createDir(dir) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
  }
}
