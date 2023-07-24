import { io } from "./server";
import { authenticateSocket } from "../lib/middleware/authentication";
import {
  handleGetMessages,
  handleNewMessage,
} from "./modules/messaging/handlers";
import logger from "../lib/logger";
import db from "../lib/db";

io.use(authenticateSocket);

io.on("connection", async (socket) => {
  let users;
  try {
    users = await db.user.findMany({
      select: {
        username: true,
      },
    });
  } catch (error) {
    logger.fatal(error);
  }

  let channels;
  try {
    channels = await db.channel.findMany({
      select: {
        name: true,
      },
    });
  } catch (error) {
    logger.fatal(error);
  }

  socket.join(socket.data.user?.username as string);

  users?.forEach((user) => {
    socket.join([socket.data.user?.username, user.username].sort().join("-"));
  });

  channels?.forEach((channel) => {
    socket.join(channel.name);
  });

  socket.on("messages:get_old_messages", handleGetMessages(socket));
  socket.on("messages:new_message", handleNewMessage(socket));
});

export default io;
