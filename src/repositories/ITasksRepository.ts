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
  pagesNumber?: number;
}

export interface ITasksRepository {
  create(data: ICreateTaskDTO): Promise<Task>;

  getOneById(id: string): Promise<Task | null>;

  getOneByTitle(title: string): Promise<Task | null>;

  getTasks({
    limit,
    skip,
  }: {
    limit: number;
    skip: number;
  }): Promise<IGetTasksDTO>;

  deleteOne(task: Task): Promise<void>;
}
