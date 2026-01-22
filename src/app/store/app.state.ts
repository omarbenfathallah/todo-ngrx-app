import { ActionReducerMap } from '@ngrx/store';
import { authReducer, AuthState } from './reducers/auth.reducer';
import { taskReducer, TaskState } from './reducers/tasks.reducer';

export interface AppState {
  auth: AuthState;
  tasks: TaskState;
}

export const reducers: ActionReducerMap<AppState> = {
  auth: authReducer,
  tasks: taskReducer
};
