import { RequestHandler } from "express";
import db from "../../../lib/db";
import io from "../../socketio";
import { CreateChannelDataSchema } from "../zod-schemas";

const createChannelHandler: RequestHandler = async (req, res, next) => {
  const { name, channelMembers } = CreateChannelDataSchema.parse(req.body);
  let channel;
  try {
    channel = await db.channel.create({
      data: {
        name,
        users: {
          // Include channel creator too
          connect: channelMembers.concat(req.user.username).map((username) => ({
            username,
          })),
        },
      },
    });

    // Join all existing sockets to this new channel.
    io.of("/").socketsJoin(channel.name);
  } catch (error) {
    next(error);
    return;
  }

  res.status(201).json(channel);
};

export default createChannelHandler;
