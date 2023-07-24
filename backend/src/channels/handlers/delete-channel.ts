import { RequestHandler } from "express";
import db from "../../../lib/db";

const deleteChannelHandler: RequestHandler = async (req, res, next) => {
  let channel;
  try {
    channel = await db.channel.delete({
      where: {
        name: req.params.channelName,
      },
    });
  } catch (error) {
    next(error);
    return;
  }

  res.json(channel);
};

export default deleteChannelHandler;
