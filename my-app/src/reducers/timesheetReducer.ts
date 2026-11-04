import type { TimesheetAction } from "../actions/timesheetActions"
import type { TimesheetRecord } from "../types/timesheetTypes"

export type TimesheetState = {
  records: TimesheetRecord[]
}

const initialState: TimesheetState = {
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
