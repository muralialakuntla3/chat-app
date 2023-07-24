import { AuthState } from "../types";
import StorageKeys from "./storage-keys";

export function persistAuthState(authState: AuthState) {
  const authStateSerialized = JSON.stringify(authState);
  const storage =
    localStorage.getItem(StorageKeys.REMEMBER_ME) == "true"
      ? localStorage
      : sessionStorage;
  storage.setItem(StorageKeys.AUTH_STATE, authStateSerialized);
}

export function destroyAuthState() {
  localStorage.removeItem(StorageKeys.AUTH_STATE);
  sessionStorage.removeItem(StorageKeys.AUTH_STATE);
}

export function retriveAuthState(): AuthState | null {
  const storage =
    localStorage.getItem(StorageKeys.REMEMBER_ME) == "true"
      ? localStorage
      : sessionStorage;
  const authStateSerialized = storage.getItem(StorageKeys.AUTH_STATE);
  if (!authStateSerialized) {
    return null;
  }

  let authState: AuthState;
  try {
    authState = JSON.parse(authStateSerialized) as AuthState;
  } catch (error) {
    console.error(error);
    return null;
  }

  return authState;
}
