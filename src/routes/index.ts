import { CreateTaskController } from '~/controllers/CreateTaskController';
import { DeleteTaskByIdController } from '~/controllers/DeleteTaskByIdController';
import { Router } from 'express';

const router = Router();

router.post('/tasks', new CreateTaskController().handle);
router.delete('/tasks/:id', new DeleteTaskByIdController().handle);

export { router };
