import { createReducer, on } from '@ngrx/store';
import { Umfrage } from './umfrage.model';
import * as UmfrageActions from './umfrage.actions';

export const initialState: Umfrage[] = [];

export const umfrageReducer = createReducer(
  initialState,
  on(UmfrageActions.loadUmfragenSuccess, (state, { Umfragen }) => [...Umfragen])
);
