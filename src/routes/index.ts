import { CreateTaskController } from '~/controllers/CreateTaskController';
import { Router } from 'express';

const router = Router();

router.post('/tasks', new CreateTaskController().handle);

export { router };
