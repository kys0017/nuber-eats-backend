import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import { config as dotenvConfig } from 'dotenv';

const path =
  process.env.NODE_ENV === 'prod' || !process.env.NODE_ENV
    ? `.env`
    : `.env.${process.env.NODE_ENV}`;

dotenvConfig({ path });

const config: TypeOrmModuleOptions = {
  type: 'postgres',
  ...(process.env.DATABASE_URL
    ? { url: process.env.DATABASE_URL }
    : {
        host: process.env.DB_HOST,
        port: +process.env.DB_PORT,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD, // host: 'localhost' 이면, password 를 물어보지 않음. password 가 달라도 pass!
        database: process.env.DB_DATABASE, //'nuber-eats',
      }),
  ...(process.env.NODE_ENV === 'prod' && {
    ssl: true,
    extra: {
      ssl: {
        rejectUnauthorized: false,
      },
    },
  }),
  migrations: ['src/migrations/*{.ts,.js}'],
  migrationsRun: process.env.NODE_ENV === 'prod',
  autoLoadEntities: true,
  synchronize: false,
  // synchronize: process.env.NODE_ENV !== 'prod',
  logging: process.env.NODE_ENV !== 'prod' && process.env.NODE_ENV !== 'test',
  entities: ['src/**/*.entity{.ts,.js}'],
};

export default registerAs('typeorm', () => config);
export const connectionSource = new DataSource(config as DataSourceOptions);
