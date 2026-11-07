import React from "react";
import { useDispatch } from "react-redux";
import type { DateKey } from "../types/timesheetTypes";


interface TimesheetCellProps {
  date: DateKey;        // 👈 Added date parameter to prevent cross-day collisions
  hour: number;
  value?: string;
  isDirty?: boolean;
}

export const TimesheetCell: React.FC<TimesheetCellProps> = ({ 
  date, 
  hour, 
  value = "", 
  isDirty 
}) => {
  const dispatch = useDispatch();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: "CELL_VALUE_CHANGE",
      payload: { 
        date,             // 👈 Send date along to Redux
        hour, 
        title: e.target.value 
      },
    });
  };

  return (
    <div style={{ display: "flex", alignItems: "center", padding: "4px 0" }}>
      <span style={{ width: 60, fontSize: "12px", color: "#666" }}>
        {String(hour).padStart(2, "0")}:00
      </span>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        style={{
          flex: 1,
          padding: "6px",
          border: isDirty ? "1px solid #ffc107" : "1px solid #ddd",
          backgroundColor: isDirty ? "#fffdf5" : "#fff",
        }}
      />
    </div>
  );
};
