import type { DateKey,TimesheetRecord } from "../types/timesheetTypes"
  
import type { Dispatch } from "redux";

export type TimesheetAction =
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
      type: "SET_DATE_AND_RECORDS"; 
      payload: { currentDate: DateKey; records: TimesheetRecord[] } 
    }
	;


// Async action to change day and fetch records from Laravel backend
export const changeDayAndFetch = (daysToAdd: number) => {
  return async (dispatch: Dispatch<TimesheetAction>, getState: any) => {
    const state = getState();
    
    // 1. Calculate the new date string
    const currentDate = new Date(state.timesheet.currentDate);
    currentDate.setDate(currentDate.getDate() + daysToAdd);
    const newDateStr = currentDate.toISOString().split("T")[0] as DateKey;

    try {
      // 2. Fetch tasks/records for this specific date from your Laravel API
      // Adjust endpoint URL to match your Laravel routing (e.g., /api/timesheets?date=YYYY-MM-DD)
      const response = await fetch(`http://127.0.0.1:8000/api/timesheets?date=${newDateStr}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Add Authorization token here if your Laravel API uses Sanctum/JWT
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch records from Laravel API");
      }

      const records: TimesheetRecord[] = await response.json();

      // 3. Dispatch a combined action to update both date and records in Redux
      dispatch({
        type: "SET_DATE_AND_RECORDS",
        payload: {
          currentDate: newDateStr,
          records: records,
        },
      });
    } catch (error) {
      console.error("Error fetching day records:", error);
      // Fallback: Just update the date even if the API call fails or is offline
      dispatch({
        type: "CHANGE_DAY",
        payload: daysToAdd,
      });
    }
  };
};

  
  
  
  
