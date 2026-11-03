// components/DayView.tsx
import React from "react";
import { TimesheetCell } from "./TimesheetCell";

const HOURS = Array.from({ length: 24 }, (_, i) => i);

export const DayView: React.FC = () => {
  // Day View 預設展示單一日 (例如 2026-11-01)
  const currentDate = "2026-11-01";

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
        }}
      >
        Mon ({currentDate})
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
              key={`day-cell-${hour}`}
              date={currentDate}
              hour={hour}
            />
          </React.Fragment>
        );
      })}
    </div>
  );
};


