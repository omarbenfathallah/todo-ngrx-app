// src/app/components/task-form/task-form.component.ts

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss']
})
export class TaskFormComponent implements OnInit {
  @Input() task: Task | null = null;
  @Output() submitTask = new EventEmitter<Partial<Task>>();
  @Output() cancel = new EventEmitter<void>();

  taskForm!: FormGroup;
  priorities = [1, 2, 3, 4, 5];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.taskForm = this.fb.group({
      title: [this.task?.title || '', [Validators.required, Validators.minLength(3)]],
      description: [this.task?.description || '', [Validators.required, Validators.minLength(10)]],
      priority: [this.task?.priority || 3, [Validators.required, Validators.min(1), Validators.max(5)]],
      dueDate: [this.task?.dueDate ? new Date(this.task.dueDate).toISOString().split('T')[0] : '', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      const taskData: Partial<Task> = {
        ...this.taskForm.value,
        dueDate: new Date(this.taskForm.value.dueDate)
      };

      if (this.task) {
        taskData.id = this.task.id;
        taskData.completed = this.task.completed;
        taskData.userId = this.task.userId;
        taskData.createdAt = this.task.createdAt;
      }

      this.submitTask.emit(taskData);
      this.taskForm.reset();
    }
  }

  onCancel(): void {
    this.cancel.emit();
    this.taskForm.reset();
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
}
