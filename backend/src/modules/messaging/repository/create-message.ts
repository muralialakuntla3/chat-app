import { Message } from "@prisma/client";
import db from "../../../../lib/db";
import { CreateMessageData } from "../../../types";

async function createMessage(
  message: CreateMessageData & Pick<Message, "fromUsername">
) {
  const newMessage = await db.message.create({
    data: {
      text: message.text,
      [message.chatType === "channel" ? "channelName" : "toUsername"]:
        message.chatType === "channel" ? message.channelName : message.username,
      fromUsername: message.fromUsername,
    },
  });

  return newMessage;
}

export default createMessage;
