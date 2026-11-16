import { AppDispatch } from "../store";
import { getCurrentWeekRange } from "../utils/dateUtils";
import { fetchInitialRecords } from "./timesheetActions"; // Separate data loading thunk

export type AuthAction = 
  | { type: "LOGIN_SUCCESS",
      payload: { 
        userId: string, 
        token: string 
      } 
    }
  | { type: "LOGOUT" };



export const checkStoredSession = () => async (dispatch: AppDispatch) => {
  const token = localStorage.getItem("auth_token");
  const storedUserId = localStorage.getItem("current_user_id");

  if (!token || !storedUserId) {
    dispatch({ type: "SESSION_CHECK_FAILED" });
    return;
  }

  try {
    // Step 1: Validate auth/token status against the server first
    const authResponse = await fetch("http://127.0.0.1:8000/api/auth/verify", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id: storedUserId }),
    });

    // Step 2: Handle server-side rejection (revoked, disabled, or no matching session)
    if (!authResponse.ok) {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("current_user_id");
      dispatch({ type: "SESSION_EXPIRED_OR_REVOKED" });
      return;
    }

    const { userId: verifiedUserId } = await authResponse.json();

    // Step 3: Auth confirmed valid. Update Redux auth state first.
    dispatch({
      type: "RESTORE_SESSION_SUCCESS",
      payload: { token, userId: verifiedUserId },
    });

    // Step 4: After auth success, safely trigger loading the user's timesheet data
    dispatch(fetchInitialRecords(token, verifiedUserId));

  } catch (error) {
    console.error("Session verification network error:", error);
    dispatch({ type: "SESSION_CHECK_FAILED" });
  }
};
