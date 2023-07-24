import { RequestHandler } from "express";
import {
  comparePasswords,
  generateToken,
  getSafeUserData,
} from "../../../../lib/auth-utils";
import db from "../../../../lib/db";
import { SignInDataSchema } from "../zod-schemas";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const signInHandler: RequestHandler = async (req, res, next) => {
  const { username, password } = SignInDataSchema.parse(req.body);

  const user = await db.user.findUnique({
    where: {
      username,
    },
  });

  // Find user
  if (!user) {
    res.status(400).json({
      error: "Invalid username or password.",
    });
    return;
  }

  // Check password
  if (!comparePasswords(password, user.passwordHash)) {
    res.status(400).json({
      error: "Invalid username or password.",
    });
    return;
  }

  // Return token
  const token = generateToken(user);
  res.json({
    token,
    user: getSafeUserData(user),
  });
};

export default signInHandler;
