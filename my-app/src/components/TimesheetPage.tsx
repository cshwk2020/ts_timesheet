import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { Toolbar } from "./Toolbar";
import { DayView } from "./DayView";
import { WeekView } from "./WeekView";
import { CellPopupEditor } from "./CellPopupEditor";


export const TimesheetPage: React.FC = () => {
  
  const viewMode = useSelector((s: RootState) => s.ui.viewMode);

  return (
    
    <div style={{ minHeight: "100vh", backgroundColor: "#f4f6f8" }}>
      
      <Toolbar />
      
      <div style={{ padding: "0 16px 32px 16px" }}>
        {viewMode === "day" ? <DayView /> : <WeekView />}
      </div>

      {/* 浮動式 Cell Editor Popup */}
      <CellPopupEditor />
      
    </div>
  );
};

