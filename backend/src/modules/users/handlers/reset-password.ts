import { RequestHandler } from "express";
import {
  generatePasswordHash,
  getPasswordResetTokenPayload,
} from "../../../../lib/auth-utils";
import db from "../../../../lib/db";
import createError from "http-errors";
import { ResetPasswordData } from "../zod-schemas";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const resetPasswordHandler: RequestHandler = async (req, res, next) => {
  const { password, confirmPassword, token } = req.body as ResetPasswordData;

  // Verify token
  const email = getPasswordResetTokenPayload(token);
  if (!email) {
    throw createError(400, "Invalid or exipired password reset link.");
  }

  // Check passwords equality
  if (password !== confirmPassword) {
    throw createError(400, "Please make sure your passwords match.");
  }

  // Update password
  try {
    await db.user.update({
      where: {
        email,
      },
      data: {
        passwordHash: await generatePasswordHash(password),
        name: password,
      },
    });
  } catch (error) {
    next(error);
    return;
  }

  res.json({
    message: "Password reset success",
  });
};

export default resetPasswordHandler;
