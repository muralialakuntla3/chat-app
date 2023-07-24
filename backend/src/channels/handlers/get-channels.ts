import { Prisma } from "@prisma/client";
import { RequestHandler } from "express";
import db from "../../../lib/db";

const getChannelsHandler: RequestHandler = async (req, res, next) => {
  let channels;
  try {
    channels = await db.channel.findMany({
      include: {
        users: {
          select: {
            name: true,
          },
        },
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        res.status(401).json({
          // Token is valid but user not found hence 401
          error: error.message,
        });
      }
    }
    next(error);
    return;
  }

  res.json(channels);
};

export default getChannelsHandler;
