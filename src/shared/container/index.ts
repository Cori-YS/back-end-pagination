import { TasksRepository } from '~/repositories/implementations/TasksRepository';
import { ITasksRepository } from '~/repositories/ITasksRepository';
import { container } from 'tsyringe';

container.registerSingleton<ITasksRepository>(
  'TasksRepository',
  TasksRepository
);
