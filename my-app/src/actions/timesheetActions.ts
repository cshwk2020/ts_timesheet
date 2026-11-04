import type { TimesheetRecord } from "../types/timesheetTypes"

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
