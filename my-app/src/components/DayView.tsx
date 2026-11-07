import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { TimesheetCell } from "./TimesheetCell";
import type { RootState } from "../store";


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
  const currentDate = useSelector((state: any) => state.timesheet.currentDate || new Date().toISOString().split("T")[0]);

  
  // prev next
  
  const handlePrevDay = () => {
    dispatch({ type: "CHANGE_DAY", payload: -1 });
  };

  const handleNextDay = () => {
    dispatch({ type: "CHANGE_DAY", payload: 1 });
  };


  // save

  const records = useSelector((state: RootState) => state.timesheet.records);

  const hasDirtyCells = records.some(r => r.isDirty);

  const handleSaveAll = async () => {
    // 1. Filter only dirty records that need saving
    const dirtyRecords = records.filter(r => r.isDirty);

    if (dirtyRecords.length === 0) return;

    try {
      // 2. Send batch payload to Laravel API
      const response = await fetch("http://127.0.0.1:8000/api/timesheets/batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: currentDate,
          records: dirtyRecords,
        }),
      });

      if (!response.ok) throw new Error("Batch save failed");

      // 3. On success, dispatch action to clear dirty flags
      dispatch({ type: "SAVE_SUCCESS" });
      console.log("All dirty cells saved successfully!");
    } catch (error) {
      console.error("Error saving timesheet:", error);
    }
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

        
        <span>TEST :: {formatDayHeader(currentDate)}</span>

        <button
          onClick={handleSaveAll}
          disabled={!hasDirtyCells}
          style={{
            backgroundColor: hasDirtyCells ? "#28a745" : "#cccccc",
            color: "#ffffff",
            border: "none",
            padding: "8px 16px",
            borderRadius: "4px",
            cursor: hasDirtyCells ? "pointer" : "default",
            fontWeight: "bold",
          }}
        >
          {hasDirtyCells ? "Save Changes *" : "Saved"}
        </button>

        
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
            timesheetcell
          </React.Fragment>
        );
      })}
    </div>
  );
};
