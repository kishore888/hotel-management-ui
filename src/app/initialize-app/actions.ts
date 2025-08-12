import { createAction, props } from '@ngrx/store';
import { Hotel } from '../model/hotel.model';

export const loadData = createAction('[Data] Load Data');
export const loadDataSuccess = createAction('[Data] Load Success', props<{ hotel: any, products: any[], orders: any[] }>());
export const loadDataFailure = createAction('[Data] Load Failure', props<{ error: any }>());
