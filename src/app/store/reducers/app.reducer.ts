// src/app/store/reducers/app.reducer.ts

import { createReducer, on } from '@ngrx/store';
import { AppState } from '../../models/task.model';
import * as AppActions from '../actions/app.actions';

export const initialState: AppState = {
  user: null,
  tasks: []
};

export const appReducer = createReducer(
  initialState,

  // Auth
  on(AppActions.login, (state, { user }) => ({
    ...state,
    user
  })),

  on(AppActions.logout, (state) => ({
    ...state,
    user: null,
    tasks: []
  })),

  // Tasks
  on(AppActions.addTask, (state, { task }) => ({
    ...state,
    tasks: [...state.tasks, task]
  })),

  on(AppActions.updateTask, (state, { task }) => ({
    ...state,
    tasks: state.tasks.map(t => t.id === task.id ? task : t)
  })),

  on(AppActions.deleteTask, (state, { id }) => ({
    ...state,
    tasks: state.tasks.filter(t => t.id !== id)
  })),

  on(AppActions.toggleTask, (state, { id }) => ({
    ...state,
    tasks: state.tasks.map(t =>
      t.id === id ? { ...t, completed: !t.completed } : t
    )
  })),

  on(AppActions.loadTasks, (state, { tasks }) => ({
    ...state,
    tasks
  })),

  on(AppActions.clearTasks, (state) => ({
    ...state,
    tasks: []
  }))
);
