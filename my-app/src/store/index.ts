import {
 configureStore
} from "@reduxjs/toolkit"
import {
 timesheetReducer
} from "../reducers/timesheetReducer"
import {
 uiReducer
} from "../reducers/uiReducer"
import {
 taskReducer
} from "../reducers/taskReducer"


export const store =
 configureStore({
  reducer: {
    taskState: taskReducer,
    timesheet: timesheetReducer,
    ui: uiReducer,
  }
 })

export type RootState =
 ReturnType<
  typeof store.getState
 >

export type AppDispatch =
 typeof store.dispatch


