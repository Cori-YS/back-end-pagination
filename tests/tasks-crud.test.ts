/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable global-require */
import 'reflect-metadata';
import assert from 'assert';
import { after, before, describe, it } from 'mocha';
import sinon from 'sinon';
import request from 'supertest';
import { container } from 'tsyringe';
import { DataSource } from 'typeorm';
import { v4 as uuidV4 } from 'uuid';

import app from '../src/app';
import { Task } from '../src/models/Task';
import {
  ICreateTaskDTO,
  IGetTasksDTO,
  ITasksRepository,
} from '../src/repositories/ITasksRepository';
import { AppDataSource } from '../src/shared/infra/typeorm';

const mocks = {
  tasks: require('./mocks/tasks.json'),
};

const RESPONSES = {
  taskCreated: 'Task created with success',
  invalidTitle: 'This title is invalid!',
  thisTaskDoesNotExists: 'This task does not exists',
  taskDeleted: 'Task deleted with success',
  taskDone: 'Task marked as done with success',
};

const tasksRepositoryMock: ITasksRepository = {
  async create(data: ICreateTaskDTO): Promise<Task> {
    const task = new Task();
    Object.assign(task, data);
    return task;
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

const initializeDataSourceStub = sinon.stub(AppDataSource, 'initialize');

describe('API Suite test', () => {
  before(() => {
    initializeDataSourceStub.resolves({} as DataSource);

    container.register<ITasksRepository>('TasksRepository', {
      useValue: tasksRepositoryMock,
    });
  });
  after(() => {
    initializeDataSourceStub.restore();
  });
  describe('/tasks', () => {
    it('should be able to create a new task', async () => {
      const response = await request(app)
        .post('/tasks')
        .send(CREATE_TASK)
        .expect(201);

      assert.deepStrictEqual(
        {
          message: response.body.message,
          title: response.body.data.title,
          hasId: !!response.body.data,
        },
        {
          message: RESPONSES.taskCreated,
          title: CREATE_TASK.title,
          hasId: true,
        }
      );
    });

    it('should not be able to create a new task if the title is already in use', async () => {
      const response = await request(app)
        .post('/tasks')
        .send(mocks.tasks[0])
        .expect(400);

      assert.deepStrictEqual(response.body.message, RESPONSES.invalidTitle);
    });
  });

  describe('/tasks/:id', () => {
    it('should be able to delete an existing task', async () => {
      const response = await request(app)
        .delete(`/tasks/${mocks.tasks[0].id}`)
        .expect(200);

      assert.deepStrictEqual(response.body.message, RESPONSES.taskDeleted);
    });

    it('should not be able to delete a not existing task', async () => {
      const response = await request(app)
        .delete(`/tasks/${uuidV4()}`)
        .expect(404);

      assert.deepStrictEqual(
        response.body.message,
        RESPONSES.thisTaskDoesNotExists
      );
    });
  });

  describe('/tasks/done/:id', () => {
    it('should be able to mark as done an existing task', async () => {
      const response = await request(app)
        .patch(`/tasks/done/${mocks.tasks[0].id}`)
        .expect(200);

      assert.deepStrictEqual(response.body, {
        message: RESPONSES.taskDone,
        data: mocks.tasks[0],
      });
    });

    it('should not be able to mark as done a not existing task', async () => {
      const response = await request(app)
        .patch(`/tasks/done/${uuidV4()}`)
        .expect(404);

      assert.deepStrictEqual(
        response.body.message,
        RESPONSES.thisTaskDoesNotExists
      );
    });
  });

  describe('/tasks', () => {
    it('should be able to get the tasks', async () => {
      const response = await request(app)
        .get('/tasks')
        .query({ page: 2, limit: 2 })
        .expect(200);

      assert.deepStrictEqual(response.body.data.tasks, mocks.tasks.splice(2));
    });
  });
});
