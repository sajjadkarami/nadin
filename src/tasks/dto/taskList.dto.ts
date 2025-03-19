import { Task } from '@prisma/client';

export interface TaskList {
  data: Task[];
  page: number;
  pages: number;
  hasNextPage: boolean;
  total: number;
}
