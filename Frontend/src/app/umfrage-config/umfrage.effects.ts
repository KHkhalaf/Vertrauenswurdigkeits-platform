import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import * as UmfrageActions from './umfrage.actions';
import { UmfrageService } from './umfrage.service';

@Injectable()
export class UmfrageEffects {
  loadUmfragen$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UmfrageActions.loadUmfragen),
      switchMap(() =>
        this.umfrageservice.getUmfrage().pipe(
          map((Umfragen) => UmfrageActions.loadUmfragenSuccess({ Umfragen })),
          catchError((error) => of(UmfrageActions.loadUmfragenFailure({ error })))
        )
      )
    )
  );

  constructor(private actions$: Actions, private umfrageservice: UmfrageService) {}
}
