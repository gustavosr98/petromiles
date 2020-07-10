import * as winston from 'winston';
import { WinstonModuleOptions } from 'nest-winston';

import { consoleFormat, fileFormat } from './format';
import * as fs from 'fs';

interface createOptionsParams {
  fileName: string;
}

function createOptions(params: createOptionsParams): WinstonModuleOptions {
  const actualPath =
    process.env.NODE_ENV === 'development'
      ? `${__dirname}/../../../`
      : `${__dirname}/../../../`;

  return {
    transports: [
      new winston.transports.Console({
        level: 'silly',
        format: consoleFormat,
      }),
      new winston.transports.File({
        level: 'silly',
        format: fileFormat,
        maxsize: 5120000,
        maxFiles: 5,
        filename: `${actualPath}/logs/${params.fileName}`,
      }),
    ],
  };
}

function createDir(dir): void {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
}

export default createOptions;
