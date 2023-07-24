import { createContext } from "react";
import { AuthState } from "../../types";

interface IAuthContext extends AuthState {
  signIn: (authState: Required<AuthState>) => Promise<void>;
  signUp: (authState: Required<AuthState>) => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<IAuthContext>({
  isAuthenticated: false,
  signIn: () => {
    return Promise.reject();
  },
  signOut: () => {
    return Promise.reject();
  },
  signUp: () => {
    return Promise.reject();
  },
});

export default AuthContext;
