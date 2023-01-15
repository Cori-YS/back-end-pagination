import 'reflect-metadata';
import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import 'express-async-errors';

import './config/environment';
import './shared/container';
import { router } from './routes';
import { AppError } from './shared/errors/AppError';
import { AppDataSource } from './shared/infra/typeorm';

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
    AppDataSource.runMigrations();
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err);
  });

const app = express();

app.use(express.json());
app.use(cors());
app.use(router);

app.use(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (err: Error, request: Request, response: Response, next: NextFunction) => {
    if (err instanceof AppError) {
      return response.status(err.statusCode).json({
        message: err.message,
      });
    }

    return response.status(500).json({
      status: 'error',
      message: `Internal server error - ${err.message}`,
    });
  }
);

export default app;
