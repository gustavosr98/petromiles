import * as winston from 'winston';

const commonFormat = (winston.format.simple(), winston.format.timestamp());

export const consoleFormat = winston.format.combine(
  commonFormat,
  winston.format.splat(),
  winston.format.colorize(),
  winston.format.printf(msg => {
    return `[${new Date(msg.timestamp).toLocaleString()}] | ${msg.level} - ${
      msg.message
    }`;
  }),
);

export const fileFormat = winston.format.combine(
  commonFormat,
  winston.format.splat(),
  winston.format.printf(msg => {
    return `[${new Date(
      msg.timestamp,
    ).toLocaleString()}] |  ${msg.level.toUpperCase()} - ${msg.message}`;
  }),
);
