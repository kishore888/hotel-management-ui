import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
// import { loadData, loadDataSuccess, loadDataFailure } from './data.actions';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { loadData, loadDataFailure, loadDataSuccess } from './actions';

@Injectable()
export class DataEffects {
  constructor(private actions$: Actions, private http: HttpClient) {}

  loadData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadData),
      mergeMap(() => this.http.get('http://localhost:8880/room/retriveHotelbyId?hotelId=55LQ23392D299EGGVK').pipe(
        map((response: any) => loadDataSuccess(response)),
        catchError(error => of(loadDataFailure({ error })))
      ))
    )
  );
}
