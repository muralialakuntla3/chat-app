import { Socket } from "socket.io-client";
import { APIError, ChatType, CreateMessageData, Message } from ".";

export interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: boolean) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
  "users:user_online": (username: string) => void;
  "users:user_offline": (username: string) => void;
  "users:user_created": (username: string) => void;
  "messages:new_message": (message: Message) => void;
  app_error: (error: APIError) => void;
}

export interface ClientToServerEvents {
  "messages:new_message": (message: CreateMessageData) => void;
  "messages:get_old_messages": (
    cursor: string | null,
    chatType: ChatType,
    to: string,
    callback: (page: { data: Message[]; nextCursor: string | null }) => void
  ) => void;
}

export type AppSocket = Socket<ClientToServerEvents, ServerToClientEvents>;
