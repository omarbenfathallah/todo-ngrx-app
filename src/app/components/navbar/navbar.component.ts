// src/app/components/navbar/navbar.component.ts

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { User } from '../../models/user.model';
import { selectUser } from '../../store/selectors/app.selectors';
import * as AppActions from '../../store/actions/app.actions';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  user$!: Observable<User | null>;

  constructor(
    private store: Store,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.user$ = this.store.select(selectUser);
  }

  logout(): void {
    this.store.dispatch(AppActions.logout());
    this.router.navigate(['/login']);
  }
}
