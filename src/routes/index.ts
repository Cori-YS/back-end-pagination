import { CreateTaskController } from '~/controllers/CreateTaskController';
import { DeleteTaskByIdController } from '~/controllers/DeleteTaskByIdController';
import { GetTasksController } from '~/controllers/GetTasksController';
import { MarkTaskAsDoneController } from '~/controllers/MarkTaskAsDoneController';
import { Router } from 'express';

const router = Router();

router.post('/tasks', new CreateTaskController().handle);
router.delete('/tasks/:id', new DeleteTaskByIdController().handle);
router.patch('/tasks/done/:id', new MarkTaskAsDoneController().handle);
router.get('/tasks', new GetTasksController().handle);

export { router };
