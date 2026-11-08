
export type AuthAction = 
  | { type: "LOGIN_SUCCESS",
      payload: { 
        userId: string, 
        token: string 
      } 
    }
  | { type: "LOGOUT" };