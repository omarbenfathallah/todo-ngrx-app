import { User } from "./user.model";

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: number;
  dueDate: Date;
  completed: boolean;
  userId: string;
  createdAt: Date;
}


export interface AppState {
  user: User | null;
  tasks: Task[];
}
