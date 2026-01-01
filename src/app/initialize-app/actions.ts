import { createAction, props } from '@ngrx/store';
import { Hotel } from '../model/hotel.model';
import { Room } from '../model/room.model';

export const loadHotel = createAction('[Data] Load Hotel Data');
export const loadHotelSuccess = createAction('[Data] Load Hotel Success', props<{ hotel: Hotel}>());
export const loadHotelFailure = createAction('[Data] Load Hotel Failure', props<{ error: any }>());

export const loadRooms = createAction('[App Init] Load Rooms'); 
export const loadRoomsSuccess = createAction( '[Room API] Load Rooms Success', props<{ rooms: Room[] }>() ); 
export const loadRoomsFailure = createAction( '[Room API] Load Rooms Failure', props<{ error: string }>() );
