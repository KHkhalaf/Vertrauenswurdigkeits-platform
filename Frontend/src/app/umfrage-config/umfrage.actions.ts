import { createAction, props } from '@ngrx/store';
import { Umfrage } from './umfrage.model';

export const loadUmfragen = createAction('[Umfragen] Load Umfragen');
export const loadUmfragenSuccess = createAction('[Umfragen] Load Umfragen Success', props<{ Umfragen: Umfrage[] }>());
export const loadUmfragenFailure = createAction('[Umfragen] Load Umfragen Failure', props<{ error: any }>());
