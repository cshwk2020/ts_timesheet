// components/Toolbar.tsx
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";

export const Toolbar: React.FC = () => {
  const dispatch = useDispatch();
  const viewMode = useSelector((s: RootState) => s.ui.viewMode);

  const handleSetViewMode = (mode: "day" | "week") => {
    dispatch({
      type: "UI_SET_VIEW_MODE",
      payload: { viewMode: mode },
    });
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px 16px",
        backgroundColor: "#1976d2",
        color: "#fff",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        marginBottom: 12,
      }}
    >
      <div style={{ fontSize: 18, fontWeight: "bold" }}>
        Timesheet App
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <button
          onClick={() => handleSetViewMode("day")}
          style={{
            padding: "6px 16px",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
            fontWeight: "bold",
            backgroundColor: viewMode === "day" ? "#fff" : "transparent",
            color: viewMode === "day" ? "#1976d2" : "#fff",
            border: viewMode === "day" ? "none" : "1px solid #fff",
          }}
        >
          Day
        </button>
        <button
          onClick={() => handleSetViewMode("week")}
          style={{
            padding: "6px 16px",
            borderRadius: 4,
            cursor: "pointer",
            fontWeight: "bold",
            backgroundColor: viewMode === "week" ? "#fff" : "transparent",
            color: viewMode === "week" ? "#1976d2" : "#fff",
            border: viewMode === "week" ? "none" : "1px solid #fff",
          }}
        >
          Week
        </button>
      </div>
    </div>
  );
};



