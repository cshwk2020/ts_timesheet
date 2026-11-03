// components/WeekView.tsx
import React from "react";
import { TimesheetCell } from "./TimesheetCell";

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export const WeekView: React.FC = () => {
  
  return (
    
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "60px repeat(7, minmax(120px, 1fr))",
        backgroundColor: "#fff",
        overflowX: "auto",
      }}
    >
      
      {/* Header Row */}
      <div style={{ borderBottom: "2px solid #ccc", padding: 8 }} />
      {DAYS.map((day, index) => {
        // 示範以 2026-11-01 作為當周基底日期推算
        const dayNum = (index + 1).toString().padStart(2, "0");
        const dateStr = `2026-11-${dayNum}`;
        return (
          <div
            key={day}
            style={{
              borderBottom: "2px solid #ccc",
              borderRight: "1px solid #e0e0e0",
              padding: "8px 4px",
              textAlign: "center",
              fontWeight: "bold",
              fontSize: "14px",
              backgroundColor: "#f8f9fa",
            }}
          >
            {day} <span style={{ fontSize: "11px", color: "#666", display: "block" }}>{dateStr}</span>
          </div>
        );
      })}

      {/* Time Rows */}
      {HOURS.map((hour) => {
        const hourStr = hour.toString().padStart(2, "0");
        return (
          <React.Fragment key={`hour-${hour}`}>
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

            {/* 7 Days Cells */}
            {DAYS.map((day, index) => {
              const dayNum = (index + 1).toString().padStart(2, "0");
              const dateStr = `2026-11-${dayNum}`;
              return (
                <TimesheetCell
                  key={`${day}-${hour}`}
                  date={dateStr}
                  hour={hour}
                />
              );
            })}
          </React.Fragment>
        );
      })}
    </div>
  );
};



