import type { TimesheetAction } from "../actions/timesheetActions"
import type { DateKey, TimesheetRecord } from "../types/timesheetTypes"


export type TimesheetState = {
	currentDate: DateKey,
  currentUserId: string,
  records: TimesheetRecord[]
}

const initialState: TimesheetState = {
	currentDate: new Date().toISOString().split("T")[0],
  currentUserId: "u1",
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

  
    case "RECORD_VALUE_CHANGE": {
      
      const { id, remark, fromDateTime, toDateTime } = action.payload;
      
      const existingIndex = state.records.findIndex(r => r.id === id);

      let updatedRecords = [...state.records];
      
      if (existingIndex >= 0) {
        // Update existing record and flag as dirty
        updatedRecords[existingIndex] = {
          ...updatedRecords[existingIndex],
          ...(remark !== undefined && { remark }),
          ...(fromDateTime !== undefined && { fromDateTime }),
          ...(toDateTime !== undefined && { toDateTime }),
          isDirty: true,
        };
        
      } else {
        // Add a new unsaved record locally
        updatedRecords.push({
          id,
          userId: state.currentUserId, // or current user context
          taskId: action.payload.taskId || "",
          fromDateTime: fromDateTime || `${state.currentDate} 09:00:00`,
          toDateTime: toDateTime || `${state.currentDate} 10:00:00`,
          remark,
          lastUpdatedAt: new Date().toISOString(),
          isDirty: true,
        });
      }

      return { ...state, records: updatedRecords };
    }
      

    case "SAVE_SUCCESS": {
      // Clear the dirty flags after Laravel batch save succeeds
      return {
        ...state,
        records: state.records.map(r => ({ ...r, isDirty: false })),
      };
    }

      
	case "CHANGE_DAY": 
      const daysToAdd = action.payload; // -1, 1, -7, 7 等
      const date = new Date(state.currentDate);
      date.setDate(date.getDate() + daysToAdd);
      
      const newDateStr = date.toISOString().split("T")[0];
      return {
        ...state,
        currentDate: newDateStr,
      }
      

    case "SET_DATE_AND_RECORDS": {
      return {
        ...state,
        currentDate: action.payload.currentDate,
        records: action.payload.records.map(r => ({ ...r, isDirty: false })),
      };
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
