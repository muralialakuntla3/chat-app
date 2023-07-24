import { AppSocket, ClientToServerEvents } from "./socketio";

export type SocketEventHandler<T extends keyof ClientToServerEvents> = (
  socket: AppSocket
) => ClientToServerEvents[T];
