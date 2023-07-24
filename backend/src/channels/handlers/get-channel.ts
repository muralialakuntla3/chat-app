import { RequestHandler } from "express";
import db from "../../../lib/db";

const getChannelHandler: RequestHandler = async (req, res, next) => {
  let channel;
  try {
    channel = await db.channel.findUniqueOrThrow({
      where: {
        name: req.params.channelName,
      },
      include: {
        users: true,
      },
    });
  } catch (error) {
    next(error);
    return;
  }

  res.json(channel);
};

export default getChannelHandler;
