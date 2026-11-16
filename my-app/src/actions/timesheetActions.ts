import type { AppDispatch, RootState } from "../store";
import { timesheetApi } from "../services/timesheetApi";
import { getCurrentWeekRange, getWeekRangeForDate } from "../utils/dateUtils";
import type { DateTimeKey, DateKey,TimesheetRecord } from "../types/timesheetTypes"


export type TimesheetAction =
    | {
      type: "SET_INITIAL_RECORDS";
      payload: TimesheetRecord[];
    }
  | {
  	type: "RECORD_ADD",
  	payload: TimesheetRecord
	}
  | {
  	type: "RECORD_UPDATE",
  	payload: TimesheetRecord
	}
  | {
  	type: "RECORD_DELETE",
  	payload: {
    	id: string
  	}
	}
  | {
    type: "CHANGE_DAY",
    payload: number // e.g., -1, 1, -7, 7
  }
	| { 
    type: "SET_DATE_AND_RECORDS",
    payload: { 
      currentDate: DateKey,
      records: TimesheetRecord[] 
    } 
  }
  | {
      type: "RECORD_VALUE_CHANGE";
      payload: {
        id: string;
        userId?: string;
        fromDateTime?: DateTimeKey;
        toDateTime?: DateTimeKey;
        remark?: string;
        taskId?: string;
      }
    }
  | {
      type: "SAVE_SUCCESS";
    }
	;


 

export const saveDirtyRecords = () => async (dispatch: AppDispatch, getState: () => RootState) => {
  const state = getState();
  const token = state.auth.token;
  const records = state.timesheet.records;

  const dirtyRecords = records.filter(r => r.isDirty);
  if (dirtyRecords.length === 0) return;

  try {
    // Call the isolated API service
    await timesheetApi.batchSave(token!, dirtyRecords);

    // Update Redux state on success
    dispatch({ type: "SAVE_SUCCESS" });
    console.log("Synced dirty records to Laravel DB!");
  } catch (error) {
    console.error("Save error:", error);
    // Optionally dispatch a SAVE_FAILURE action here if you track error states in Redux
  }
};



// 1. Core private helper for fetching and hydrating Redux state
const fetchAndHydrateTimesheets = async (
  dispatch: AppDispatch,
  token: string,
  userId: string,
  startDate: string,
  endDate: string
) => {
  try {
    const data = await timesheetApi.fetchRange(token, userId, startDate, endDate);

    // Hydrate store with records and clear dirty flags
    dispatch({
      type: "SET_INITIAL_RECORDS",
      payload: data,
    });
  } catch (error) {
    console.error("Timesheet fetch error:", error);
  }
};



// 2. Initial app load fetch (uses current week range)
export const fetchInitialRecords = (token: string, userId: string) => async (dispatch: AppDispatch) => {
  const { startDate, endDate } = getCurrentWeekRange();
  await fetchAndHydrateTimesheets(dispatch, token, userId, startDate, endDate);
};



// 3. Navigation fetch (changing days/weeks via service + clean fallback)
export const changeDayAndFetch = (daysToAdd: number) => async (dispatch: AppDispatch, getState: () => RootState) => {
  const state = getState();
  const token = state.auth.token;
  const userId = state.auth.currentUserId;

  if (!token || !userId) return;

  // Optimistically update the active date in Redux state first
  dispatch({ type: "CHANGE_DAY", payload: daysToAdd });

  // Get the newly updated currentDate from state and compute its range
  const updatedDateStr = getState().timesheet.currentDate;
  const { startDate, endDate } = getWeekRangeForDate(updatedDateStr);

  try {
    // Fetch records via the service layer
    const data = await timesheetApi.fetchRange(token, userId, startDate, endDate);

    // Update records for the new range
    dispatch({
      type: "SET_INITIAL_RECORDS",
      payload: data,
    });
  } catch (error) {
    console.error("Error fetching navigation records:", error);
    // Note: The date is already changed locally, but if the API fails, 
    // you can choose how to handle fallback behavior here if needed.
  }
};
