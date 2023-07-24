import { io, Socket } from "socket.io-client";
import { retriveAuthState } from "./auth-utils";
import { ServerToClientEvents, ClientToServerEvents } from "../types/socketio";

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  import.meta.env.VITE_SOCKET_URL,
  {
    autoConnect: false,
    auth: (callback) => {
      const authState = retriveAuthState();
      if (!authState) {
        throw new Error(
          "Socket trying to connect before user authentication token available"
        );
      }
      callback({
        token: authState.token,
      });
    },
  }
);

// Log all events in development mode
socket.onAny((event, ...args) => {
  if (import.meta.env.MODE === "development") {
    console.log(event, args);
  }
});

export default socket;
