import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import * as UnternehmenActions from './unernehmen.actions';
import { UnternehmenService } from './unternehmen.service';

@Injectable()
export class UnternehmenEffects {
  loadUnternehmenn$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UnternehmenActions.loadUnternehmen),
      switchMap(() =>
        this.unternehmenService.getUnternehmen().pipe(
          map((Unternehmen) => UnternehmenActions.loadUnternehmenSuccess({ Unternehmen })),
          catchError((error) => of(UnternehmenActions.loadUnternehmenFailure({ error })))
        )
      )
    )
  );

  constructor(private actions$: Actions, private unternehmenService: UnternehmenService) {}
}
