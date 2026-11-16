import type { AppDispatch } from "../store";
import { fetchInitialRecords } from "./timesheetActions"; // Separate data loading thunk

export type AuthAction = 
  | { type: "LOGIN_SUCCESS",
      payload: { 
        userId: string, 
        token: string 
      } 
    }
  | { type: "LOGOUT" };




interface LoginCredentials {
  email: string;
  password: string;
}

export const loginUser = (credentials: LoginCredentials) => {

  console.log("loginUser......", JSON.stringify(credentials));

  return async (dispatch: AppDispatch) => {
    try {
      // 1. Call your Laravel API login endpoint
      const response = await fetch("http://127.0.0.1:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      console.log("data==", data);

      if (!response.ok) {
        throw new Error(data.message || "Invalid email or password");
      }

      // Expected response structure from Laravel: { token, user: { id, ... } or userId }
      const token = data?.access_token;
      const userId = data?.user?.id;

      if (!token || !userId) {
        throw new Error("Invalid response structure from server");
      }

      // 2. Save token and current_user_id to match checkStoredSession keys
      localStorage.setItem("auth_token", token);
      localStorage.setItem("current_user_id", String(userId));

      // 3. Dispatch LOGIN_SUCCESS with your exact payload structure
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: {
          userId: String(userId),
          token,
        },
      });

      // 4. Trigger initial data load (matching checkStoredSession behavior)
      dispatch(fetchInitialRecords(token, String(userId)));

      return data;
    } catch (error: any) {
      throw new Error(error.message || "Unable to connect to the server");
    }
  };
};
  




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
