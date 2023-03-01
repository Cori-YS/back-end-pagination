/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable global-require */
import 'reflect-metadata';
import assert from 'assert';
import { describe, it } from 'mocha';
import sinon from 'sinon';
import request from 'supertest';
import { container } from 'tsyringe';
import { DataSource } from 'typeorm';

import app from '../src/app';
import { Task } from '../src/models/Task';
import {
  ICreateTaskDTO,
  IGetTasksDTO,
  ITasksRepository,
} from '../src/repositories/ITasksRepository';
import { AppDataSource } from '../src/shared/infra/typeorm';

const mocks = {
  task: require('./mocks/task.json'),
  tasks: require('./mocks/tasks.json'),
};

const tasksRepositoryMock: ITasksRepository = {
  async create(data: ICreateTaskDTO): Promise<Task> {
    return mocks.task;
  },
  async getOneById(id: string): Promise<Task | null> {
    const tasks = mocks.tasks as Task[];
    return tasks.find((task) => task.id === id) || null;
  },

  async getOneByTitle(title: string): Promise<Task | null> {
    const tasks = mocks.tasks as Task[];
    return tasks.find((task) => task.title === title) || null;
  },

  async getTasks({
    limit,
    skip,
  }: {
    limit: number;
    skip: number;
  }): Promise<IGetTasksDTO> {
    const tasks = mocks.tasks as Task[];
    const pageTask = tasks.slice(skip, skip + limit);
    return { tasks: pageTask, total: tasks.length };
  },

  async deleteOne(task: Task): Promise<void> {},
};

const CREATE_TASK = {
  title: 'Testar',
  description: 'Deves efetuar o teste da criação',
  done: true,
};

describe('API Suite test', () => {
  describe('/tasks', () => {
    it('should be able to create a new task', async () => {
      const initializeDataSourceStub = sinon.stub(AppDataSource, 'initialize');

      initializeDataSourceStub.resolves({} as DataSource);

      container.register<ITasksRepository>('TasksRepository', {
        useValue: tasksRepositoryMock,
      });

      const response = await request(app)
        .post('/tasks')
        .send(CREATE_TASK)
        .expect(201);

      assert.deepStrictEqual(response.body, {
        message: 'Task created with success',
        data: mocks.task,
      });

      initializeDataSourceStub.restore();
    });

    it('should not be able to create a new task if the title is already in use', async () => {
      const initializeDataSourceStub = sinon.stub(AppDataSource, 'initialize');

      initializeDataSourceStub.resolves({} as DataSource);

      container.register<ITasksRepository>('TasksRepository', {
        useValue: tasksRepositoryMock,
      });

      const response = await request(app)
        .post('/tasks')
        .send(mocks.tasks[0])
        .expect(400);

      assert.deepStrictEqual(response.body.message, 'This title is invalid!');
      initializeDataSourceStub.restore();
    });
  });
});
