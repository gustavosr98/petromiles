import { WinstonModuleOptions } from 'nest-winston';
export interface WinstonOptions {
  createOptions(...info): WinstonModuleOptions;
}
