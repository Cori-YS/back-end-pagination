import { DataSource } from 'typeorm';

import { Task } from '../../../models/Task';
import { CreateTasksTable1673802127327 } from './migrations/1673802127327-CreateTasksTable';

const entities = [Task];

const migrations = [CreateTasksTable1673802127327];

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  synchronize: false,
  logging: true,
  entities,
  subscribers: [],
  migrations,
});
