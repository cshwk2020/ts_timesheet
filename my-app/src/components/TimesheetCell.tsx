import React, { useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../store";
import type { DateKey } from "../types/timesheetTypes";

type TimesheetCellProps = {
  date: DateKey;
  hour: number;
};

export const TimesheetCell: React.FC<TimesheetCellProps> = ({ date, hour }) => {
  const dispatch = useDispatch();
  const cellRef = useRef<HTMLDivElement>(null);

  // 格式化 hour 變 "HH:00:00" 去對應 fromDateTime
  const hourStr = hour.toString().padStart(2, "0");
  const targetTimePrefix = `${date} ${hourStr}:00:00`;

  // 從 Redux 搵出呢個鐘數對應嘅 record
  const record = useSelector((s: RootState) =>
    s.timesheet.records.find((r) => r.fromDateTime === targetTimePrefix)
  );

  const tasks = useSelector((s: RootState) => s.taskState.tasks);
  const task = tasks.find((t) => t.id === record?.taskId);

  const handleClick = () => {
    if (cellRef.current) {
      const rect = cellRef.current.getBoundingClientRect();
      dispatch({
        type: "UI_OPEN_EDITOR",
        payload: {
          date,
          hour,
          recordId: record?.id,
          cellRect: {
            left: rect.left,
            top: rect.top,
            bottom: rect.bottom,
            right: rect.right,
            width: rect.width,
            height: rect.height,
          },
        },
      });
    }
  };

  return (
    <div
      ref={cellRef}
      onClick={handleClick}
      style={{
        border: "1px solid #e0e0e0",
        height: 48,
        padding: "4px 8px",
        fontSize: "12px",
        background: record ? "#e3f2fd" : "transparent",
        cursor: "pointer",
        overflow: "hidden",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
      }}
    >
      {task ? task.taskDesc : ""}
    </div>
  );
};

