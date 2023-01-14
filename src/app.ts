import 'reflect-metadata';
import cors from 'cors';
import express from 'express';

import './config/environment';
import { AppDataSource } from './shared/infra/typeorm';

AppDataSource.initialize();

const app = express();

app.use(express.json());
app.use(cors());

export default app;
