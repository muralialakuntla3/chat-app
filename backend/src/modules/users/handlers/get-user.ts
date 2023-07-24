import { RequestHandler } from "express";
import db from "../../../../lib/db";

const getUserHandler: RequestHandler = async (req, res, next) => {
  const { username } = req.params;

  let user;
  try {
    user = await db.user.findUniqueOrThrow({
      where: { username },
      select: {
        avatar: true,
        name: true,
        username: true,
        email: true,
      },
    });
  } catch (error) {
    next(error);
    next;
  }

  res.json(user);
};

export default getUserHandler;
