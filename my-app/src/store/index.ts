import { combineReducers } from 'redux'; // or @reduxjs/toolkit
import { taskReducer } from '../reducers/taskReducer';
//import type { TaskAction } from '../actions/taskActions';
import { timesheetReducer } from '../reducers/timesheetReducer';
//import type { TimesheetAction } from '../actions/timesheetActions';
import { uiReducer } from '../reducers/uiReducer';
//import type { UiAction } from '../actions/uiActions';

import {
 configureStore
} from "@reduxjs/toolkit";



// 3. Pass BOTH types into combineReducers
const rootReducer = combineReducers({
  taskState: taskReducer,
  timesheet: timesheetReducer,
  ui: uiReducer,
});

export const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch




