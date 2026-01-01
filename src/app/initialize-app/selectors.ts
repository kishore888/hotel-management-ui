import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AppState, RoomState } from './app-state';

//hotel
export const selectHotelFeature = createFeatureSelector<AppState>('data');
export const selectHotel = createSelector(selectHotelFeature, (state: AppState) => state.hotel);

//Rooms
export const selectRoomState = createFeatureSelector<RoomState>('rooms'); 
export const selectAllRooms = createSelector( selectRoomState, (state: RoomState) => state.rooms ); 
export const selectRoomsLoading = createSelector( selectRoomState, (state: RoomState) => state.loading ); 
export const selectRoomsError = createSelector( selectRoomState, (state: RoomState) => state.error );