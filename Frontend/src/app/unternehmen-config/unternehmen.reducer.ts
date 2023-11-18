import { createReducer, on } from '@ngrx/store';
import { Unternehmen } from './unternehmen.model';
import * as UnternehmenActions from './unernehmen.actions';

export const initialState: Unternehmen[] = [];

export const UnternehmenReducer = createReducer(
  initialState,
  on(UnternehmenActions.loadUnternehmenSuccess, (state, { Unternehmen }) => [...Unternehmen])
);
