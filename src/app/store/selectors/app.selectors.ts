// src/app/store/app.selectors.ts
import { createSelector } from '@ngrx/store';
import { AppState } from '../app.state';
import { AuthState } from '../reducers/auth.reducer';
import { TaskState } from '../reducers/tasks.reducer';

// ---------------------------
// Sélecteurs de base
// ---------------------------
export const selectAuthState = (state: AppState): AuthState =>
  state.auth ?? { user: null, isAuthenticated: false };

export const selectTaskState = (state: AppState): TaskState =>
  state.tasks ?? { tasks: [], loading: false, error: null };

// ---------------------------
// Sélecteurs dérivés pour Auth
// ---------------------------
export const selectCurrentUser = createSelector(
  selectAuthState,
  (state: AuthState) => state?.user ?? null,
);

export const selectIsAuthenticated = createSelector(
  selectAuthState,
  (auth: AuthState) => auth.isAuthenticated, // maintenant ça lit bien
);
// ---------------------------
// Sélecteurs dérivés pour Tasks
// ---------------------------
export const selectAllTasks = createSelector(
  selectTaskState,
  (state: TaskState) => state?.tasks ?? [],
);

export const selectCompletedTasks = createSelector(selectAllTasks, (tasks) =>
  tasks.filter((task) => task.completed),
);

export const selectPendingTasks = createSelector(selectAllTasks, (tasks) =>
  tasks.filter((task) => !task.completed),
);

export const selectTasksSortedByPriority = createSelector(
  selectAllTasks,
  (tasks) => [...tasks].sort((a, b) => b.priority - a.priority),
);

export const selectTasksByUser = (userId: string) =>
  createSelector(selectAllTasks, (tasks) =>
    tasks.filter((task) => task.userId === userId),
  );
