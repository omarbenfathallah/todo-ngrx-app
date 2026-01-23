// src/app/store/selectors/app.selectors.ts

import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AppState } from '../../models/task.model';

export const selectAppState = createFeatureSelector<AppState>('app');

export const selectUser = createSelector(
  selectAppState,
  (state: AppState) => state.user
);

export const selectIsAuthenticated = createSelector(
  selectUser,
  (user) => !!user
);

export const selectTasks = createSelector(
  selectAppState,
  (state: AppState) => state.tasks
);

export const selectPendingTasks = createSelector(
  selectTasks,
  (tasks) => tasks.filter(t => !t.completed)
);

export const selectCompletedTasks = createSelector(
  selectTasks,
  (tasks) => tasks.filter(t => t.completed)
);
