// src/app/store/reducers/auth.reducer.ts
import { createReducer, on } from '@ngrx/store';
import { User } from '../../models/user.model';
import * as AuthActions from '../actions/auth.actions';

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean; // <-- ajouter
}

export const initialState: AuthState = {
  user: null,
  isAuthenticated: false // par défaut non connecté
};

export const authReducer = createReducer(
  initialState,

  // Connexion
  on(AuthActions.login, (state, { user }) => ({
    ...state,
    user,
    isAuthenticated: true // <-- mettre à jour ici
  })),

  // Déconnexion
  on(AuthActions.logout, (state) => ({
    ...state,
    user: null,
    isAuthenticated: false // <-- mettre à jour ici
  }))
);
