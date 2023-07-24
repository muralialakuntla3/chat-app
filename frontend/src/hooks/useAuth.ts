import { useContext } from "react";
import AuthContext from "../contexts/authentication/AuthContext";

function useAuth() {
  return useContext(AuthContext);
}

export default useAuth;
