import { createAction, props } from '@ngrx/store';
import { Hotel } from '../model/hotel.model';
import { Room } from '../model/room.model';
import { Employee } from '../model/employee.model';
import { FieldConfig } from '../model/form-config.model';

export const loadHotel = createAction('[Data] Load Hotel Data', props<{ hotelId: string }>());
export const loadHotelSuccess = createAction('[Data] Load Hotel Success', props<{ hotel: Hotel}>());
export const loadHotelFailure = createAction('[Data] Load Hotel Failure', props<{ error: any }>());

export const loadRooms = createAction('[App Init] Load Rooms'); 
export const loadRoomsSuccess = createAction( '[Room API] Load Rooms Success', props<{ rooms: Room[] }>() ); 
export const loadRoomsFailure = createAction( '[Room API] Load Rooms Failure', props<{ error: string }>() );

export const loadEmployeesSuccess = createAction('[Employee] Load Employees Success', props<{ employees: Employee[] }>());
export const loadEmployeesFailure = createAction('[Employee] Load Employees Failure', props<{ error: any }>());
export const upsertEmployee       = createAction('[Employee] Upsert Employee',         props<{ employee: Employee }>());
export const removeEmployee       = createAction('[Employee] Remove Employee',         props<{ employeeId: string }>());

export const loadFormConfig        = createAction('[FormConfig] Load',         props<{ hotelId: string; entityType: string }>());
export const loadFormConfigSuccess = createAction('[FormConfig] Load Success', props<{ entityType: string; fields: FieldConfig[] }>());
export const loadFormConfigFailure = createAction('[FormConfig] Load Failure', props<{ error: any }>());
export const saveFormConfigSuccess = createAction('[FormConfig] Save Success', props<{ entityType: string; fields: FieldConfig[] }>());
