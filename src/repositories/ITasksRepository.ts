import { Task } from '~/models/Task';

export interface ICreateTaskDTO {
  id?: string;
  title: string;
  description?: string;
  done?: boolean;
}

export interface IGetTasksDTO {
  tasks: Task[];
  total: number;
}

export interface ITasksRepository {
  create(data: ICreateTaskDTO): Promise<Task>;

  getOneById(id: string): Promise<Task | null>;

  getOneByTitle(title: string): Promise<Task | null>;

  getTasks({
    page_limit,
    jump,
  }: {
    page_limit: number;
    jump: number;
  }): Promise<IGetTasksDTO>;

  deleteOne(task: Task): Promise<void>;
}
