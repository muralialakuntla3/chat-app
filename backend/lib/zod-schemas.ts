import { z } from "zod";

export const NumberStringSchema = z
  .string()
  .transform((text) => parseInt(text));

export const SearchQuerySchema = z.object({
  search: z
    .string()
    .optional()
    .transform((v) => v?.toLocaleLowerCase()),
});

export const UsernameParamsSchema = z.object({
  username: z.string().min(6),
});

export const ChannelNameParamsSchema = z.object({
  channelName: z.string().min(6),
});

export const EmailSchema = z
  .string()
  .trim()
  .email()
  .transform((v) => v.toLowerCase());

export const EmailQueryParamsSchema = z.object({
  email: EmailSchema,
});

export const ChatTypeSchema = z.enum(["dm", "channel"]);
