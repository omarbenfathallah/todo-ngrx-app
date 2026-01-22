// src/app/components/login/login.component.ts

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { AppState } from '../../store/app.state';
import * as AuthActions from '../../store/actions/auth.actions';
import * as TaskActions from '../../store/actions/tasks.actions';
import { selectIsAuthenticated } from '../../store/selectors/app.selectors';
import { v4 as uuidv4 } from 'uuid';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }
onSubmit(): void {
  if (this.loginForm.valid) {
    const email = this.loginForm.value.email;

    const user = { id: uuidv4(), email };

    // Dispatch login
    this.store.dispatch(AuthActions.login({ user }));

    // Charger tâches mock
    this.store.dispatch(
      TaskActions.setTasks({
        tasks: [
          {
            id: '1',
            title: 'Tâche 1',
            description: 'Description 1',
            completed: false,
            priority: 1,
            userId: email,
            dueDate: new Date(),
            createdAt: new Date(),
          },
        ],
      })
    );

    // ✅ Naviguer uniquement après que l'état a été mis à jour
    this.store
      .select(selectIsAuthenticated)
      .pipe(take(1))
      .subscribe((isAuth) => {
        if (isAuth) {
          console.log('User logged in:', user);
          this.router.navigate(['/tasks']); // maintenant ça fonctionne
        }
      });
  }
}
}
