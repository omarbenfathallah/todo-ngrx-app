

import { createAction, props } from '@ngrx/store';
import { Task } from '../../models/task.model';

// Actions pour les tâches
export const addTask = createAction(
  '[Task] Add Task',
  props<{ task: Task }>()
);
export const setTasks = createAction(
  '[Tasks] Set Tasks',
  props<{ tasks: Task[] }>()
);


export const updateTask = createAction(
  '[Task] Update Task',
  props<{ task: Task }>()
);

export const deleteTask = createAction(
  '[Task] Delete Task',
  props<{ id: string }>()
);

export const toggleTaskComplete = createAction(
  '[Task] Toggle Task Complete',
  props<{ id: string }>()
);

export const loadTasks = createAction(
  '[Task] Load Tasks',
  props<{ userId: string }>()
);

export const clearTasks = createAction(
  '[Task] Clear Tasks'
);
