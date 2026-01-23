// src/app/store/actions/app.actions.ts

import { createAction, props } from '@ngrx/store';
import { Task } from '../../models/task.model';
import { User } from 'src/app/models/user.model';

// Auth Actions
export const login = createAction(
  '[Auth] Login',
  props<{ user: User }>()
);

export const logout = createAction('[Auth] Logout');

// Task Actions
export const addTask = createAction(
  '[Task] Add',
  props<{ task: Task }>()
);

export const updateTask = createAction(
  '[Task] Update',
  props<{ task: Task }>()
);

export const deleteTask = createAction(
  '[Task] Delete',
  props<{ id: string }>()
);

export const toggleTask = createAction(
  '[Task] Toggle',
  props<{ id: string }>()
);

export const loadTasks = createAction(
  '[Task] Load',
  props<{ tasks: Task[] }>()
);

export const clearTasks = createAction('[Task] Clear');
