import { ITasksRepository } from '~/repositories/ITasksRepository';
import { AppError } from '~/shared/errors/AppError';
import { inject, injectable } from 'tsyringe';

@injectable()
class DeleteTaskByIdService {
  constructor(
    @inject('TasksRepository') private tasksRepository: ITasksRepository
  ) {}

  async execute(id: string): Promise<void> {
    const task = await this.tasksRepository.getOneById(id);

    if (!task) {
      throw new AppError('This task does not exists', 404);
    }

    await this.tasksRepository.deleteOne(task);
  }
}

export { DeleteTaskByIdService };
