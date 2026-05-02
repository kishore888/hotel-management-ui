import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
// import { loadData, loadDataSuccess, loadDataFailure } from './data.actions';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { loadHotel, loadHotelFailure, loadHotelSuccess, loadRooms, loadRoomsFailure, loadRoomsSuccess } from './actions';
import { RoomService } from '../room/room.service';
import { Hotel } from '../model/hotel.model';

@Injectable()
export class DataEffects {
  constructor(private actions$: Actions, private http: HttpClient, private roomService: RoomService) {}

  loadHotel$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadHotel),
      mergeMap(({ hotelId }) => {
        console.log('🏨 loadHotel effect fired — hotelId:', hotelId);
        return this.http.get<Hotel>(`http://localhost:8880/room/retriveHotelbyId?hotelId=${hotelId}`).pipe(
          map((hotel) => { console.log('✅ Hotel loaded:', hotel); return loadHotelSuccess({ hotel }); }),
          catchError(error => { console.error('❌ Hotel load failed:', error); return of(loadHotelFailure({ error })); })
        );
      })
    )
  );


  loadRooms$ = createEffect(() => 
    this.actions$.pipe( 
      ofType(loadRooms), 
        mergeMap(() => 
          this.roomService.getRooms().pipe( 
            map(rooms => 
            loadRoomsSuccess({ rooms })), 
            catchError(error => of(loadRoomsFailure({ error: error.message })) 
          ) 
        ) 
      ) 
    ) 
  );
}
