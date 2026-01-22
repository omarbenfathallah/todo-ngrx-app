
import { createReducer, on } from '@ngrx/store';
import { Task } from '../../models/task.model';
import * as TaskActions from '../actions/tasks.actions';

export interface TaskState {
  tasks: Task[];
}

export const initialState: TaskState = {
  tasks: []
};

export const taskReducer = createReducer(
  initialState,

  // Ajouter une tâche
  on(TaskActions.addTask, (state, { task }) => ({
    ...state,
    tasks: [...state.tasks, task]
  })),

  // Mettre à jour une tâche
  on(TaskActions.updateTask, (state, { task }) => ({
    ...state,
    tasks: state.tasks.map(t => t.id === task.id ? task : t)
  })),

  // Supprimer une tâche
  on(TaskActions.deleteTask, (state, { id }) => ({
    ...state,
    tasks: state.tasks.filter(t => t.id !== id)
  })),

  // Basculer l'état de complétion
  on(TaskActions.toggleTaskComplete, (state, { id }) => ({
    ...state,
    tasks: state.tasks.map(t =>
      t.id === id ? { ...t, completed: !t.completed } : t
    )
  })),

  // Charger les tâches d'un utilisateur (depuis localStorage)
  on(TaskActions.loadTasks, (state, { userId }) => {
    const storedTasks = localStorage.getItem(`tasks_${userId}`);
    return {
      ...state,
      tasks: storedTasks ? JSON.parse(storedTasks) : []
    };
  }),

  // Vider les tâches
  on(TaskActions.clearTasks, (state) => ({
    ...state,
    tasks: []
  }))
);
