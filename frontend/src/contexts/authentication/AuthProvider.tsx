import { useNavigate } from "react-router-dom";
import { AuthState } from "../../types";
import AuthContext from "./AuthContext";
import { useState } from "react";
import {
  destroyAuthState,
  persistAuthState,
  retriveAuthState,
} from "../../lib/auth-utils";
import { notify } from "../../lib/notifications";

type AuthProviderProps = {
  children: React.ReactNode;
};

function AuthProvider(props: AuthProviderProps) {
  const navigate = useNavigate();
  const [authState, setAuthState] = useState<AuthState>(
    retriveAuthState() || {}
  );

  const signIn = async (authState: Required<AuthState>) => {
    setAuthState(authState);
    persistAuthState(authState);
    // If already logged in and signing in again with updated user data. ex: me.tsx /me
    if (!authState.token) {
      navigate("/");
      notify({
        type: "success",
        title: "Welcome back!",
        message: "You have successfully signed in.",
      });
    }
  };

  const signUp = async (authState: Required<AuthState>) => {
    setAuthState(authState);
    persistAuthState(authState);
    navigate("/");
    notify({
      type: "success",
      title: "Welcome!",
      message: "You have successfully signed up.",
    });
  };

  const signOut = async () => {
    setAuthState({});
    destroyAuthState();
    navigate("/sign-in");
    notify({
      type: "success",
      title: "Goodbye!",
      message: "You have successfully signed out.",
    });
  };

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signUp,
        signOut,
        isAuthenticated: !!authState.token,
        ...authState,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
