import React from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store";
import type { DateKey, DateTimeKey } from "../types/timesheetTypes";

interface TimesheetCellProps {
  date: DateKey;
  hour: number;
  value?: string;
  recordId?: string;
  isDirty?: boolean;
}

export const TimesheetCell: React.FC<TimesheetCellProps> = ({ 
  date, 
  hour, 
  value = "", 
  recordId,
  isDirty = false
}) => {
  const dispatch = useDispatch();

  // Grab currentUserId from the independent auth slice
  const currentUserId = useSelector((state: RootState) => state.auth.currentUserId);

  // Format hour into standard start/end DateTimeKey strings for backend compatibility
  const formattedHour = String(hour).padStart(2, "0");
  const fromDateTime = `${date} ${formattedHour}:00:00` as DateTimeKey;
  const toDateTime = `${date} ${formattedHour}:59:59` as DateTimeKey;

  // Use existing recordId or derive a deterministic temporary client ID for new entries
  const id = recordId || `temp-${date}-${hour}`;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: "RECORD_VALUE_CHANGE",
      payload: { 
        id,
        userId: currentUserId,
        fromDateTime,
        toDateTime,
        remark: e.target.value,
      },
    });
  };

  return (
    <div style={{ display: "flex", alignItems: "center", padding: "4px 0" }}>
      {/* Hourly Slot Label */}
      <span style={{ width: 60, fontSize: "12px", color: "#666" }}>
        {formattedHour}:00
      </span>

      {/* Cell Remark Input */}
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder="Add task remark..."
        style={{
          flex: 1,
          padding: "6px",
          fontSize: "13px",
          borderRadius: "4px",
          outline: "none",
          border: isDirty ? "1px solid #ffc107" : "1px solid #ddd",
          backgroundColor: isDirty ? "#fffdf5" : "#ffffff",
          transition: "border-color 0.2s, background-color 0.2s",
        }}
      />

      {/* Optional Dirty Indicator Star */}
      {isDirty && (
        <span 
          style={{ 
            marginLeft: "8px", 
            fontSize: "12px", 
            color: "#856404", 
            fontWeight: "bold" 
          }}
          title="Unsaved changes"
        >
          *
        </span>
      )}
    </div>
  );
};
