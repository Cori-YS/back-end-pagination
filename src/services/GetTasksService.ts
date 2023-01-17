import {
  IGetTasksDTO,
  ITasksRepository,
} from '~/repositories/ITasksRepository';
import { inject, injectable } from 'tsyringe';

interface IRequest {
  page?: number;
  limit?: number;
}

@injectable()
class GetTasksService {
  constructor(
    @inject('TasksRepository') private tasksRepository: ITasksRepository
  ) {}

  async execute({ page = 1, limit = 20 }: IRequest): Promise<IGetTasksDTO> {
    const skip = (page - 1) * limit;

    const { tasks, total } = await this.tasksRepository.getTasks({
      limit,
      skip,
    });

    const pagesNumber = Math.round(total / limit);

    return { tasks, pagesNumber, total };
  }
}

export { GetTasksService };
