
export type DateKey = string
// yyyy-MM-dd
export type TimeKey = string
// HH:mm
export type DateTimeKey = string
// yyyy-MM-dd HH:mm:ss

export type DateRange = {
  from: DateKey,
  to: DateKey
}

export type TimeSlotInterval = 15 | 30 | 60

export type TimesheetSettings = {
  userId: string,
  slotIntervalMinutes: TimeSlotInterval,
  lastUpdatedAt: DateTimeKey
}


export type TaskCategory = {
  id: string,
  userId: string,
  taskCatDesc: string,
lastUpdatedAt: DateTimeKey

}

export type Task = {
  id: string,
  userId: string,
  taskCategoryId: string,
  taskDesc: string,
lastUpdatedAt: DateTimeKey

}

export type TimesheetRecord = {
  id: string,
  userId: string,
  taskId: string,
  fromDateTime: DateTimeKey,
  toDateTime: DateTimeKey,
  remark?: string,
  lastUpdatedAt: DateTimeKey,
  isDirty?: boolean,
}





