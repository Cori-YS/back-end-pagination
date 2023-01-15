import { CreateTaskService } from '~/services/CreateTaskService';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

class CreateTaskController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { title, description, done } = request.body;

    const createTaskService = container.resolve(CreateTaskService);

    const task = await createTaskService.execute({ title, description, done });

    return response
      .status(201)
      .json({ message: 'Task created with success', data: task });
  }
}

export { CreateTaskController };
