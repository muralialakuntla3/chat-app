import { RequestHandler } from "express";
import { sendPasswordResetLink } from "../../../../lib/auth-utils";
import db from "../../../../lib/db";
import { EmailQueryParam } from "../../../types";
import createError from "http-errors";
import logger from "../../../../lib/logger";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const forgotPasswordHandler: RequestHandler = async (req, res, next) => {
  const { email } = req.query as EmailQueryParam;

  // Find user
  let user;
  try {
    user = await db.user.findUnique({
      where: {
        email,
      },
    });
  } catch (error) {
    next(error);
    return;
  }

  // Email reset link
  if (user) {
    try {
      await sendPasswordResetLink(user.email);
    } catch (error) {
      logger.fatal(error);
      next(createError(500));
    }
  }

  res.json({
    error:
      "If an account exists with this email, you'll receive password reset link",
  });
};

export default forgotPasswordHandler;
