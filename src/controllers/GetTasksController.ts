import { GetTasksService } from '~/services/GetTasksService';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

interface IRequest {
  page?: number;
  limit?: number;
}

export class GetTasksController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { page, limit } = request.query as IRequest;

    const getTasksService = container.resolve(GetTasksService);

    const { tasks, pagesNumber, total } = await getTasksService.execute({
      page,
      limit,
    });

    return response.json({
      data: { tasks, total, page, limit, pagesNumber },
    });
  }
}
