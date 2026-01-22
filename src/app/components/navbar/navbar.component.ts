// src/app/components/navbar/navbar.component.ts

import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AppState } from '../../store/app.state';
import { selectCurrentUser } from '../../store/selectors/app.selectors';
import * as AuthActions from '../../store/actions/auth.actions';
import * as TaskActions from '../../store/actions/tasks.actions';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  user$!: Observable<User | null>;

  constructor(
    private store: Store<AppState>,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.user$ = this.store.select(selectCurrentUser);
  }

  logout(): void {
    // Dispatch des actions de déconnexion
    this.store.dispatch(TaskActions.clearTasks());
    this.store.dispatch(AuthActions.logout());

    // Redirection vers la page de connexion
    this.router.navigate(['/login']);
  }
}
