import { combineReducers } from 'redux'; // or @reduxjs/toolkit
import { taskReducer, type TaskState } from '../reducers/taskReducer';
import type { TaskAction } from '../actions/taskActions';
import { timesheetReducer, type TimesheetState } from '../reducers/timesheetReducer';
import type { TimesheetAction } from '../actions/timesheetActions';
import { uiReducer, type UiState } from '../reducers/uiReducer';
import type { UiAction } from '../actions/uiActions';
import {authReducer, type AuthState} from '../reducers/authReducers';
import type {AuthAction} from '../actions/authActions';

import {
 configureStore
} from "@reduxjs/toolkit";


export type RootAction = AuthAction | TaskAction | TimesheetAction | UiAction;


export interface RootState {
  auth: AuthState;
  taskState: TaskState;
  timesheet: TimesheetState;
  ui: UiState;
}
/*
const rootReducer: Reducer<RootState, RootAction> = combineReducers({
  auth: authReducer,
  taskState: taskReducer,
  timesheet: timesheetReducer,
  ui: uiReducer,
});
*/




// 3. Pass BOTH types into combineReducers
const rootReducer = combineReducers({
  auth: authReducer,
  taskState: taskReducer,
  timesheet: timesheetReducer,
  ui: uiReducer,
});



export const store = configureStore({
  reducer: rootReducer,
});

// export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch




