import { Task } from '~/models/Task';
import { ITasksRepository } from '~/repositories/ITasksRepository';
import { AppError } from '~/shared/errors/AppError';
import { inject, injectable } from 'tsyringe';

@injectable()
class MarkTaskAsDoneService {
  constructor(
    @inject('TasksRepository') private tasksRepository: ITasksRepository
  ) {}

  async execute(id: string): Promise<Task> {
    const task = await this.tasksRepository.getOneById(id);

    if (!task) {
      throw new AppError('This task does not exists', 404);
    }

    task.done = true;

    return this.tasksRepository.create({ ...task });
  }
}

export { MarkTaskAsDoneService };
