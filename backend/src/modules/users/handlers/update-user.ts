import { RequestHandler } from "express";
import { generateToken, getSafeUserData } from "../../../../lib/auth-utils";
import db from "../../../../lib/db";
import { UpdateUserData } from "../zod-schemas";

const updateUserHandler: RequestHandler = async (req, res, next) => {
  const updateData = req.body as UpdateUserData;

  let user;
  try {
    user = await db.user.update({
      where: {
        username: req.user.username,
      },
      data: {
        avatar: updateData.avatar,
        name: updateData.name,
        username: updateData.username,
      },
    });
  } catch (error) {
    next(error);
    return;
  }

  // Return auth payload signed for updated data.
  const token = generateToken(user);
  return void res.json({
    token,
    user: getSafeUserData(user),
  });
};

export default updateUserHandler;
