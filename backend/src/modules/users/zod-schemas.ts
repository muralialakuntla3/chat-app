import { z } from "zod";

const PasswordSchema = z.string().min(6);

export const SignInDataSchema = z.object({
  username: z.string().trim(),
  password: PasswordSchema,
});

export const SignUpDataSchema = SignInDataSchema.merge(
  z.object({
    name: z.string().trim(),
    email: z
      .string()
      .email()
      .trim()
      .transform((v) => v.toLocaleLowerCase()),
  })
);

export const UpdateUserSchema = SignUpDataSchema.pick({
  username: true,
  name: true,
  email: true,
}).merge(
  z.object({
    avatar: z.string().optional(),
  })
);

export type UpdateUserData = z.infer<typeof UpdateUserSchema>;

export const ResetPasswordSchema = z.object({
  password: PasswordSchema,
  confirmPassword: PasswordSchema,
  token: z.string().min(1),
});

export type ResetPasswordData = z.infer<typeof ResetPasswordSchema>;
