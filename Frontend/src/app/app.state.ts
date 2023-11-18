import { ActionReducerMap } from '@ngrx/store';
import { Umfrage } from './umfrage-config/umfrage.model';
import { umfrageReducer } from './umfrage-config/umfrage.reducer';
import { Unternehmen } from './unternehmen-config/unternehmen.model';
import { UnternehmenReducer } from './unternehmen-config/unternehmen.reducer';


export const appReducers: ActionReducerMap<AppState> = {
    umfragen: umfrageReducer,
    Unternehmen: UnternehmenReducer,
  };

export interface AppState {
  umfragen: Umfrage[];
  Unternehmen: Unternehmen[];
}