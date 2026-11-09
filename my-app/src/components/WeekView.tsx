import React from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import type { TimesheetRecord } from "../types/timesheetTypes";
import { TimesheetCell } from "./TimesheetCell";

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// Helper to get Monday of the given date string
const getMondayOfWeek = (dateStr: string): Date => {
  const d = new Date(dateStr);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
  return new Date(d.setDate(diff));
};

export const WeekView: React.FC = () => {
  const records = useSelector((state: RootState) => state.timesheet.records);
  const currentDate = useSelector((state: RootState) => state.timesheet.currentDate);

  // Calculate the 7 dates of the current week dynamically based on currentDate
  const monday = getMondayOfWeek(currentDate);
  const weekDates = DAYS.map((_, index) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + index);
    return d.toISOString().split("T")[0]; // "YYYY-MM-DD"
  });

  return (
    <div style={{ width: "100%", overflowX: "auto", border: "1px solid #ccc", borderRadius: "4px" }}>
      {/* Outer container with fixed minWidth to prevent cell crushing & overlapping */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "60px repeat(7, 150px)", // 👈 Fixed column widths ensure clean horizontal scroll
          minWidth: "1110px", 
          backgroundColor: "#fff",
        }}
      >
        {/* Header Row */}
        <div style={{ borderBottom: "2px solid #ccc", padding: 8, backgroundColor: "#f8f9fa" }} />
        {DAYS.map((day, index) => {
          const dateStr = weekDates[index];
          const isToday = dateStr === currentDate;
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
                backgroundColor: isToday ? "#e8f4fd" : "#f8f9fa",
              }}
            >
              {day} <span style={{ fontSize: "11px", color: "#666", display: "block" }}>{dateStr}</span>
            </div>
          );
        })}

        {/* Hourly Grid Rows */}
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

              {/* 7 Day Grid Cells */}
              {DAYS.map((day, index) => {
                const dateStr = weekDates[index];
                const targetFromTime = `${dateStr} ${hourStr}:00:00`;

                // Match exact timestamp from Redux store records
                const matchingRecord = records.find(
                  (r: TimesheetRecord) => r.fromDateTime === targetFromTime
                );

                return (
                  <div
                    key={`${day}-${hour}`}
                    style={{
                      borderRight: "1px solid #e0e0e0",
                      borderBottom: "1px solid #e0e0e0",
                      height: 48,
                      padding: "4px",
                      display: "flex",
                      alignItems: "center",
                      overflow: "hidden",
                    }}
                  >
                    <TimesheetCell
                      date={dateStr}
                      hour={hour}
                      value={matchingRecord?.remark || ""}
                      recordId={matchingRecord?.id}
                      isDirty={matchingRecord?.isDirty || false}
                    />
                  </div>
                );
              })}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
