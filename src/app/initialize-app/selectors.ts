import { createSelector } from '@ngrx/store';
import { AppState } from './app-state';
// import { AppState } from './app.state';

export const selectHotel = createSelector(
  (state: AppState) => state.hotel,
  hotel => hotel
);

export const selectProducts = createSelector(
  (state: AppState) => state.products,
  products => products
);

export const selectOrders = createSelector(
  (state: AppState) => state.orders,
  orders => orders
);
