 
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store";
import { checkStoredSession } from "../actions/authActions";
import { Toolbar } from "./Toolbar";
import { DayView } from "./DayView";
import { WeekView } from "./WeekView";
import { CellPopupEditor } from "./CellPopupEditor";
import { LoginPage } from "./LoginPage";

export const TimesheetPage: React.FC = () => {

  const dispatch = useDispatch<AppDispatch>();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const viewMode = useSelector((s: RootState) => s.ui.viewMode);

  useEffect(() => {
    // Report app loaded to trigger session check via Redux thunk
    dispatch(checkStoredSession());
  }, [dispatch]);

  if (!isAuthenticated) {
    //return <div>Checking session / Please log in...</div>;
    return <LoginPage />;
  }
  
  return (
    
    <div style={{ minHeight: "100vh", backgroundColor: "#f4f6f8" }}>
      
      <Toolbar />
      
      <div style={{ padding: "0 16px 32px 16px" }}>
        {viewMode === "day" ? <DayView /> : <WeekView />}
      </div>

   
      <CellPopupEditor />
      
    </div>
  );
};

