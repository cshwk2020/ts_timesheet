import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { TimesheetCell } from "./TimesheetCell";

const HOURS = Array.from({ length: 24 }, (_, i) => i);

// 格式化日期與星期的輔助函數 (例如 "Mon (2026-11-01)")
const formatDayHeader = (dateStr: string) => {
  const dateObj = new Date(dateStr);
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const dayName = days[dateObj.getDay()];
  return `${dayName} (${dateStr})`;
};

export const DayView: React.FC = () => {
  const dispatch = useDispatch();

  // 從 Redux Store 取得當前選取的日期 (預設為今天或傳入的預設值)
  // 請根據你的 store 結構調整 state.timesheet.currentDate
  const currentDate = useSelector((state: any) => state.timesheet.currentDate || new Date().toISOString().split("T")[0]);

  // 切換日期的 Handler
  const handlePrevDay = () => {
    dispatch({ type: "CHANGE_DAY", payload: -1 });
  };

  const handleNextDay = () => {
    dispatch({ type: "CHANGE_DAY", payload: 1 });
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "60px 1fr",
        backgroundColor: "#fff",
        maxWidth: "600px",
        margin: "0 auto",
      }}
    >
      {/* Header Row */}
      <div style={{ borderBottom: "2px solid #ccc", padding: 8 }} />
      <div
        style={{
          borderBottom: "2px solid #ccc",
          padding: "8px 4px",
          textAlign: "center",
          fontWeight: "bold",
          fontSize: "14px",
          backgroundColor: "#f8f9fa",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <button
          onClick={handlePrevDay}
          style={{
            cursor: "pointer",
            padding: "2px 8px",
            fontSize: "14px",
          }}
        >
          &lt;
        </button>

        <span>{formatDayHeader(currentDate)}</span>

        <button
          onClick={handleNextDay}
          style={{
            cursor: "pointer",
            padding: "2px 8px",
            fontSize: "14px",
          }}
        >
          &gt;
        </button>
      </div>

      {/* Time Rows */}
      {HOURS.map((hour) => {
        const hourStr = hour.toString().padStart(2, "0");
        return (
          <React.Fragment key={`day-hour-${hour}`}>
            {/* Hour Label Column */}
            <div
              style={{
                borderRight: "1px solid #ccc",
                borderBottom: "1px solid #e0e0e0",
                height: 48,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "12px",
                color: "#666",
                backgroundColor: "#f8f9fa",
              }}
            >
              {hourStr}:00
            </div>

            {/* Single Day Cell */}
            <TimesheetCell
              key={`day-cell-${currentDate}-${hour}`}
              date={currentDate}
              hour={hour}
            />
          </React.Fragment>
        );
      })}
    </div>
  );
};
