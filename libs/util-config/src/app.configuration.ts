import { Inject } from '@nestjs/common';
import { ConfigType, registerAs } from '@nestjs/config';

export const appConfiguration = registerAs('app', () => {
  return {
    protocol: process.env.PROTOCOL || 'http',
    host: process.env.HOST || 'localhost',
    port: +process.env.PORT || 3000,

    get domain(): string {
      return `${this.protocol}://${this.host}:${this.port}`;
    },
  };
});

export type AppConfiguration = ConfigType<typeof appConfiguration>;

export const InjectAppConfig = () => Inject(appConfiguration.KEY);
