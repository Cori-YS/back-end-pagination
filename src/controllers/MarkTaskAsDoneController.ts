import { MarkTaskAsDoneService } from '~/services/MarkTaskAsDoneService';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

export class MarkTaskAsDoneController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const markTaskAsDoneService = container.resolve(MarkTaskAsDoneService);

    const task = await markTaskAsDoneService.execute(id);

    return response.json({
      message: 'Task marked as done with success',
      data: task,
    });
  }
}
