import { Router } from "express";
import { userHandlers } from "./handlers";
import validator from "../../../lib/middleware/validator";
import {
  ResetPasswordSchema,
  SignInDataSchema,
  SignUpDataSchema,
  UpdateUserSchema,
} from "./zod-schemas";
import {
  EmailQueryParamsSchema,
  SearchQuerySchema,
  UsernameParamsSchema,
} from "../../../lib/zod-schemas";

const userRouter = Router({
  mergeParams: true,
});

userRouter.get(
  "/:username",
  validator(UsernameParamsSchema, "params"),
  userHandlers.getUserHandler
);

userRouter.post(
  "/sign-in",
  validator(SignInDataSchema),
  userHandlers.signInHandler
);

userRouter.post(
  "/sign-up",
  validator(SignUpDataSchema),
  userHandlers.signUpHandler
);

userRouter.post(
  "/forgot-password",
  validator(EmailQueryParamsSchema, "query"),
  userHandlers.forgotPasswordHandler
);

userRouter.post(
  "/reset-password",
  validator(ResetPasswordSchema),
  userHandlers.resetPasswordHandler
);

userRouter.put(
  "/",
  validator(UpdateUserSchema),
  userHandlers.updateUserHandler
);

userRouter
  .route("/")
  .put(validator(UpdateUserSchema), userHandlers.updateUserHandler)
  .get(validator(SearchQuerySchema, "query"), userHandlers.getUsersListHandler);

export default userRouter;
