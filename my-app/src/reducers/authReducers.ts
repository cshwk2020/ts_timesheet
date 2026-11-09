import type { AuthAction } from "../actions/authActions";

export interface AuthState {
  currentUserId: string;
  token: string | null;
  isAuthenticated: boolean;
}

const initialAuthState: AuthState = {
  currentUserId: "",
  token: null,
  isAuthenticated: false,
};

export const authReducer = (
  state: AuthState = initialAuthState, 
  action: AuthAction
): AuthState => {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return {
        ...state,
        currentUserId: action.payload.userId,
        token: action.payload.token,
        isAuthenticated: true,
      };
    case "LOGOUT":
      return initialAuthState;
    default:
      return state;
  }
};
