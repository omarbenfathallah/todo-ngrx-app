// src/app/components/task-list/task-list.component.ts

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AppState } from '../../store/app.state';
import { Task } from '../../models/task.model';
import * as TaskActions from '../../store/actions/tasks.actions';
import {
  selectAllTasks,
  selectCurrentUser,
  selectPendingTasks,
  selectCompletedTasks
} from '../../store/selectors/app.selectors';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit, OnDestroy {
  allTasks$!: Observable<Task[]>;
  pendingTasks$!: Observable<Task[]>;
  completedTasks$!: Observable<Task[]>;
  currentUser$!: Observable<User | null>;

  showForm = false;
  editingTask: Task | null = null;
  filterType: 'all' | 'pending' | 'completed' = 'all';

  private destroy$ = new Subject<void>();

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.allTasks$ = this.store.select(selectAllTasks);
    this.pendingTasks$ = this.store.select(selectPendingTasks);
    this.completedTasks$ = this.store.select(selectCompletedTasks);
    this.currentUser$ = this.store.select(selectCurrentUser);

    // Sauvegarder automatiquement dans localStorage à chaque changement
    this.currentUser$.pipe(takeUntil(this.destroy$)).subscribe(user => {
      if (user) {
        this.allTasks$.pipe(takeUntil(this.destroy$)).subscribe(tasks => {
          localStorage.setItem(`tasks_${user.email}`, JSON.stringify(tasks));
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getFilteredTasks(): Observable<Task[]> {
    switch (this.filterType) {
      case 'pending':
        return this.pendingTasks$;
      case 'completed':
        return this.completedTasks$;
      default:
        return this.allTasks$;
    }
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.editingTask = null;
    }
  }

  onSubmitTask(taskData: Partial<Task>): void {
    this.currentUser$.pipe(takeUntil(this.destroy$)).subscribe(user => {
      if (user) {
        if (this.editingTask) {
          // Mise à jour
          const updatedTask: Task = {
            ...this.editingTask,
            ...taskData
          } as Task;
          this.store.dispatch(TaskActions.updateTask({ task: updatedTask }));
        } else {
          // Création
          const newTask: Task = {
            id: this.generateId(),
            title: taskData.title!,
            description: taskData.description!,
            priority: taskData.priority!,
            dueDate: taskData.dueDate!,
            completed: false,
            userId: user.email,
            createdAt: new Date()
          };
          this.store.dispatch(TaskActions.addTask({ task: newTask }));
        }

        this.showForm = false;
        this.editingTask = null;
      }
    }).unsubscribe();
  }

  editTask(task: Task): void {
    this.editingTask = task;
    this.showForm = true;
  }

  deleteTask(id: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
      this.store.dispatch(TaskActions.deleteTask({ id }));
    }
  }

  toggleComplete(id: string): void {
    this.store.dispatch(TaskActions.toggleTaskComplete({ id }));
  }

  cancelForm(): void {
    this.showForm = false;
    this.editingTask = null;
  }

  getPriorityClass(priority: number): string {
    if (priority >= 4) return 'priority-high';
    if (priority === 3) return 'priority-medium';
    return 'priority-low';
  }

  getPriorityLabel(priority: number): string {
    const labels: { [key: number]: string } = {
      1: 'Très basse',
      2: 'Basse',
      3: 'Moyenne',
      4: 'Haute',
      5: 'Très haute'
    };
    return labels[priority];
  }

  isOverdue(task: Task): boolean {
    return !task.completed && new Date(task.dueDate) < new Date();
  }

  private generateId(): string {
    return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
