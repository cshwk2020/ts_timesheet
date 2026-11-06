import type { Task } from "../types/timesheetTypes"
  

export type TaskAction =
  | {
  	type: "TASK_ADD",
  	payload: Task
	};

