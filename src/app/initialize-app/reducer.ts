import { createReducer, on } from '@ngrx/store';
import { Hotel } from '../model/hotel.model';
import { loadEmployeesFailure, loadEmployeesSuccess, loadFormConfigSuccess, loadHotelFailure, loadHotelSuccess, loadRooms, loadRoomsFailure, loadRoomsSuccess, removeEmployee, saveFormConfigSuccess, upsertEmployee } from './actions';
import { AppState, RoomState } from './app-state';
// import { loadDataSuccess } from './data.actions';

export const initialState: AppState = {
  hotel:       null,
  employees:   [],
  formConfigs: {}
};

export const dataReducer = createReducer(
  initialState,
  on(loadHotelSuccess, (state, { hotel }) => ({ ...state, hotel })),
  on(loadHotelFailure, (state, { error }) => ({ ...state, error })),

  on(loadEmployeesSuccess, (state, { employees }) => ({ ...state, employees })),
  on(loadEmployeesFailure, (state) => ({ ...state, employees: [] })),

  on(upsertEmployee, (state, { employee }) => {
    const exists = state.employees.some(e => e.employeeId === employee.employeeId);
    const employees = exists
      ? state.employees.map(e => e.employeeId === employee.employeeId ? employee : e)
      : [...state.employees, employee];
    return { ...state, employees };
  }),

  on(removeEmployee, (state, { employeeId }) => ({
    ...state,
    employees: state.employees.filter(e => e.employeeId !== employeeId)
  })),

  on(loadFormConfigSuccess, (state, { entityType, fields }) => ({
    ...state,
    formConfigs: { ...state.formConfigs, [entityType]: fields }
  })),
  on(saveFormConfigSuccess, (state, { entityType, fields }) => ({
    ...state,
    formConfigs: { ...state.formConfigs, [entityType]: fields }
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
