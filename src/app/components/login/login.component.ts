// src/app/components/login/login.component.ts

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Task } from '../../models/task.model';
import * as AppActions from '../../store/actions/app.actions';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onLogin(): void {
    if (this.loginForm.valid) {
      const email = this.loginForm.value.email;

      // Dispatch login action
      this.store.dispatch(AppActions.login({
        user: { email }
      }));

      // Charger les tâches depuis localStorage
      const savedTasks = localStorage.getItem(`tasks_${email}`);
      if (savedTasks) {
        const tasks: Task[] = JSON.parse(savedTasks);
        this.store.dispatch(AppActions.loadTasks({ tasks }));
      }

      // Rediriger
      this.router.navigate(['/tasks']);
    }
  }
}
