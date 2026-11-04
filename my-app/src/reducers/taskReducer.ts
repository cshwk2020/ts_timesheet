// reducers/taskReducer.ts 或合併入 rootReducer
import type { TaskCategory, Task } from "../types/timesheetTypes";
import type { TimesheetAction } from "../actions/timesheetActions";

export type TaskState = {
  taskCategories: TaskCategory[];
  tasks: Task[];
};

const initialTaskState: TaskState = {
  taskCategories: [
    { id: "study", userId: "u1", taskCatDesc: "Study", lastUpdatedAt: "" },
    { id: "life", userId: "u1", taskCatDesc: "Life", lastUpdatedAt: "" }
  ],
  tasks: [
    { id: "react", userId: "u1", taskCategoryId: "study", taskDesc: "React TS", lastUpdatedAt: "" },
    { id: "laravel", userId: "u1", taskCategoryId: "study", taskDesc: "Laravel", lastUpdatedAt: "" },
    { id: "sleep", userId: "u1", taskCategoryId: "life", taskDesc: "Sleep", lastUpdatedAt: "" }
  ]
};

export const taskReducer = (state = initialTaskState, action: TimesheetAction): TaskState => {
  return state;
};


