import { Task } from '~/models/Task';
import { AppDataSource } from '~/shared/infra/typeorm';
import { Repository } from 'typeorm';

import {
  ICreateTaskDTO,
  IGetTasksDTO,
  ITasksRepository,
} from '../ITasksRepository';

export class TasksRepository implements ITasksRepository {
  private repository: Repository<Task>;

  constructor() {
    this.repository = AppDataSource.getRepository(Task);
  }

  create({ id, title, description, done }: ICreateTaskDTO): Promise<Task> {
    const task = this.repository.create({
      id,
      title,
      description,
      done,
    });

    return this.repository.save(task);
  }

  getOneById(id: string): Promise<Task | null> {
    return this.repository.findOneBy({ id });
  }

  getOneByTitle(title: string): Promise<Task | null> {
    return this.repository.findOneBy({ title });
  }

  async getTasks({
    limit,
    skip,
  }: {
    limit: number;
    skip: number;
  }): Promise<IGetTasksDTO> {
    const [tasks, total] = await this.repository
      .createQueryBuilder('tasks')
      .take(limit)
      .skip(skip)
      .getManyAndCount();

    return { tasks, total };
  }

  async deleteOne(task: Task): Promise<void> {
    this.repository.remove(task);
  }
}
