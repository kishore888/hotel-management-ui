import { createReducer, on } from '@ngrx/store';
import { Hotel } from '../model/hotel.model';
import { loadDataSuccess } from './actions';
import { AppState } from './app-state';
// import { loadDataSuccess } from './data.actions';
// import { AppState } from './app.state';

export const initialState: AppState = {
  hotel: null,
  products: [],
  orders: []
};

export const dataReducer = createReducer(
  initialState,
  on(loadDataSuccess, (state, { hotel, products, orders }) => ({
    ...state,
    hotel,
    products,
    orders
  }))
);
