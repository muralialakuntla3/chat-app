import { z } from "zod";
import db from "../../../../lib/db";
import { sanitizeError } from "../../../../lib/errors";
import io from "../../../socketio";
import { SocketEventHandler } from "../../../types/util";
import createMessage from "../repository/create-message";
import { CreateMessageSchema } from "../zod-schemas";

export const handleNewMessage: SocketEventHandler<"messages:new_message"> =
  (socket) => async (message) => {
    let validatedMessage;
    let newMessage;
    try {
      validatedMessage = CreateMessageSchema.parse(message);
      newMessage = await createMessage({
        ...validatedMessage,
        fromUsername: z.string().parse(socket.data.user?.username),
      });
    } catch (error) {
      socket.emit("app_error", sanitizeError(error));
      return;
    }

    // Room for DM: {{sender's username}}-{{receiver's username}}
    // Room for Channels {{channelName}}
    const targetRoom =
      message.chatType === "dm"
        ? [socket.data.user?.username, message.username].sort().join("-")
        : message.channelName;
    io.to(targetRoom).emit("messages:new_message", newMessage);
  };

export const handleGetMessages: SocketEventHandler<
  "messages:get_old_messages"
> = (socket) => async (cursor, chatType, to, callback) => {
  let messages;
  try {
    // Cursor not available, for first time.
    const where =
      chatType === "dm"
        ? {
            OR: [
              {
                fromUsername: to,
                toUsername: socket.data.user?.username,
              },
              {
                toUsername: to,
                fromUsername: socket.data.user?.username,
              },
            ],
          }
        : { channelName: to };
    const take = 20;
    const orderBy = {
      time: "desc",
    } as const;

    if (!cursor) {
      messages = await db.message.findMany({
        where,
        take,
        orderBy,
      });
    } else {
      // Next pages
      messages = await db.message.findMany({
        take,
        skip: 1, // Skip the cursor
        where,
        orderBy,
        cursor: {
          id: cursor,
        },
      });
    }
  } catch (error) {
    socket.emit("app_error", sanitizeError(error));
    return;
  }

  const nextCursor = messages.length === 20 ? messages[19].id : null;

  callback({ data: messages, nextCursor });
};
