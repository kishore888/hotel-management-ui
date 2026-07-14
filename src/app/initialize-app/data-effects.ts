import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
// import { loadData, loadDataSuccess, loadDataFailure } from './data.actions';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { loadEmployeesFailure, loadEmployeesSuccess, loadFormConfigSuccess, loadHotel, loadHotelFailure, loadHotelSuccess, loadRooms, loadRoomsFailure, loadRoomsSuccess } from './actions';
import { RoomService } from '../room/room.service';
import { EmployeeService } from '../employee/employee.service';
import { FormConfigService } from '../form-config/form-config.service';
import { Hotel } from '../model/hotel.model';

@Injectable()
export class DataEffects {
  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private roomService: RoomService,
    private employeeService: EmployeeService,
    private formConfigService: FormConfigService
  ) {}

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


  loadEmployees$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadHotelSuccess),
      mergeMap(({ hotel }) =>
        this.employeeService.getEmployees(String(hotel.hotelId)).pipe(
          map(employees => loadEmployeesSuccess({ employees })),
          catchError(error => of(loadEmployeesFailure({ error })))
        )
      )
    )
  );

  loadFormConfig$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadHotelSuccess),
      mergeMap(({ hotel }) =>
        this.formConfigService.getConfig(String(hotel.hotelId), 'employee').pipe(
          map(fields => loadFormConfigSuccess({ entityType: 'employee', fields })),
          catchError(() => of(loadFormConfigSuccess({ entityType: 'employee', fields: [] })))
        )
      )
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
