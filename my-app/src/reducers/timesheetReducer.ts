import type { TimesheetAction } from "../actions/timesheetActions"
import type { DateKey, TimesheetRecord } from "../types/timesheetTypes"

export type TimesheetState = {
	currentDate: DateKey,
  records: TimesheetRecord[]
}

const initialState: TimesheetState = {
	currentDate: new Date().toISOString().split("T")[0],
  records: [
	{
  	id: "1",
  	userId: "u1",
  	taskId: "sleep",
  	fromDateTime: "2026-11-01 03:00:00",
  	toDateTime: "2026-11-01 04:00:00",
  	remark: "",
  	lastUpdatedAt: "2026-11-01 03:00:00"
	}
  ]
}

export const timesheetReducer = (
  state = initialState,
  action: TimesheetAction
): TimesheetState => {
  
  switch (action.type) {
	
	case "CHANGE_DAY": 
      const daysToAdd = action.payload; // -1, 1, -7, 7 等
      const date = new Date(state.currentDate);
      date.setDate(date.getDate() + daysToAdd);
      
      const newDateStr = date.toISOString().split("T")[0];
      return {
        ...state,
        currentDate: newDateStr,
      }

	  case "SET_DATE_AND_RECORDS": 
      return {
        ...state,
        currentDate: action.payload.currentDate,
        // Optional: Replace records or merge them. 
        // If fetching single-day data from Laravel, replace/filter records for this date:
        records: action.payload.records,
      }
    
	  

    case "RECORD_ADD":
  	return {
    	...state,
    	records: [...state.records, action.payload]
  	}
      
	
    case "RECORD_UPDATE":
  	return {
    	...state,
    	records: state.records.map(r =>
      	r.id === action.payload.id
        	? action.payload
        	: r
    	)
  	}
      
	
    case "RECORD_DELETE":
  	return {
    	...state,
    	records: state.records.filter(
      	r => r.id !== action.payload.id
    	)
  	}
      
	
    default:
  	return state
  }
}
