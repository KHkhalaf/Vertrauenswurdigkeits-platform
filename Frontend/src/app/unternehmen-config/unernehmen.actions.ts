import { createAction, props } from '@ngrx/store';
import { Unternehmen } from './unternehmen.model';

export const loadUnternehmen = createAction('[Unternehmen] Load Unternehmen');
export const loadUnternehmenSuccess = createAction('[Unternehmen] Load Unternehmen Success', props<{ Unternehmen: Unternehmen[] }>());
export const loadUnternehmenFailure = createAction('[Unternehmen] Load Unternehmen Failure', props<{ error: any }>());
