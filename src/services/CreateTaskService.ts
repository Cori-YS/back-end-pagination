import { Task } from '~/models/Task';
import { ITasksRepository } from '~/repositories/ITasksRepository';
import { AppError } from '~/shared/errors/AppError';
import { inject, injectable } from 'tsyringe';

interface IRequest {
  title: string;
  description?: string;
  done?: boolean;
}

@injectable()
class CreateTaskService {
  constructor(
    @inject('TasksRepository') private tasksRepository: ITasksRepository
  ) {}

  async execute({ title, description, done }: IRequest): Promise<Task> {
    const taskExists = await this.tasksRepository.getOneByTitle(title);

    if (taskExists) {
      throw new AppError('This title is invalid!');
    }

    const task = await this.tasksRepository.create({
      title,
      description,
      done,
    });

    return task;
  }
}

export { CreateTaskService };
