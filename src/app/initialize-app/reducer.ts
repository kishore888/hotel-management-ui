import { createReducer, on } from '@ngrx/store';
import { Hotel } from '../model/hotel.model';
import { loadHotelFailure, loadHotelSuccess, loadRooms, loadRoomsFailure, loadRoomsSuccess } from './actions';
import { AppState, RoomState } from './app-state';
// import { loadDataSuccess } from './data.actions';

export const initialState: AppState = {
  hotel: null
};

export const dataReducer = createReducer(
  initialState,
  on(loadHotelSuccess, (state, { hotel}) => ({
    ...state,
    hotel
  })),
  on(loadHotelFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))
);

export const roomInitialState: RoomState = { 
  rooms: [], loading: false, error: null 
};

export const roomReducer = createReducer(
  roomInitialState,
  on(loadRooms, state => ({ ...state, loading: true })),
  on(loadRoomsSuccess, (state, { rooms }) => ({
    ...state,
    rooms,
    loading: false,
    error: null
  })),
  on(loadRoomsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))
);
