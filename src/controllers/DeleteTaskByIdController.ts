import { DeleteTaskByIdService } from '~/services/DeleteTaskByIdService';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

export class DeleteTaskByIdController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const deleteTaskByIdService = container.resolve(DeleteTaskByIdService);

    await deleteTaskByIdService.execute(id);

    return response.json({ message: 'Task deleted with success' });
  }
}
