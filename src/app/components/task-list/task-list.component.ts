// src/app/components/task-list/task-list.component.ts

import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Task} from '../../models/task.model';
import { User } from '../../models/user.model';
import { selectTasks, selectUser, selectPendingTasks, selectCompletedTasks } from '../../store/selectors/app.selectors';
import * as AppActions from '../../store/actions/app.actions';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit, OnDestroy {
  tasks$!: Observable<Task[]>;
  pendingTasks$!: Observable<Task[]>;
  completedTasks$!: Observable<Task[]>;
  user$!: Observable<User | null>;

  taskForm!: FormGroup;
  showForm = false;
  editingTask: Task | null = null;
  filter: 'all' | 'pending' | 'completed' = 'all';

  private destroy$ = new Subject<void>();

  constructor(
    private store: Store,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.tasks$ = this.store.select(selectTasks);
    this.pendingTasks$ = this.store.select(selectPendingTasks);
    this.completedTasks$ = this.store.select(selectCompletedTasks);
    this.user$ = this.store.select(selectUser);

    this.initForm();
    this.setupAutoSave();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  initForm(): void {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      priority: [3, [Validators.required, Validators.min(1), Validators.max(5)]],
      dueDate: ['', Validators.required]
    });
  }

  setupAutoSave(): void {
    this.user$.pipe(takeUntil(this.destroy$)).subscribe(user => {
      if (user) {
        this.tasks$.pipe(takeUntil(this.destroy$)).subscribe(tasks => {
          localStorage.setItem(`tasks_${user.email}`, JSON.stringify(tasks));
        });
      }
    });
  }

  getFilteredTasks(): Observable<Task[]> {
    if (this.filter === 'pending') return this.pendingTasks$;
    if (this.filter === 'completed') return this.completedTasks$;
    return this.tasks$;
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.editingTask = null;
      this.taskForm.reset({ priority: 3 });
    }
  }

  editTask(task: Task): void {
    this.editingTask = task;
    this.showForm = true;
    this.taskForm.patchValue({
      title: task.title,
      description: task.description,
      priority: task.priority,
      dueDate: task.dueDate
    });
  }

  onSubmit(): void {
    if (this.taskForm.invalid) return;

    this.user$.pipe(takeUntil(this.destroy$)).subscribe(user => {
      if (!user) return;

      const formValue = this.taskForm.value;

      if (this.editingTask) {
        // Update
        const updatedTask: Task = {
          ...this.editingTask,
          ...formValue
        };
        this.store.dispatch(AppActions.updateTask({ task: updatedTask }));
      } else {
        // Create
        const newTask: Task = {
          id: Date.now().toString(),
          ...formValue,
          completed: false,
          userId: user.email,
          createdAt: new Date().toISOString()
        };
        this.store.dispatch(AppActions.addTask({ task: newTask }));
      }

      this.toggleForm();
    }).unsubscribe();
  }

  toggleComplete(id: string): void {
    this.store.dispatch(AppActions.toggleTask({ id }));
  }

  deleteTask(id: string): void {
    if (confirm('Supprimer cette tâche ?')) {
      this.store.dispatch(AppActions.deleteTask({ id }));
    }
  }

  getPriorityLabel(priority: number): string {
    const labels: any = {
      1: 'Très basse',
      2: 'Basse',
      3: 'Moyenne',
      4: 'Haute',
      5: 'Très haute'
    };
    return labels[priority];
  }

  getPriorityClass(priority: number): string {
    if (priority >= 4) return 'high';
    if (priority === 3) return 'medium';
    return 'low';
  }
}
