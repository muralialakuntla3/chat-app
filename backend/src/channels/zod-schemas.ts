import { z } from "zod";

export const CreateChannelDataSchema = z.object({
  name: z
    .string()
    .trim()
    .transform((v) => v.toLowerCase()),
  channelMembers: z
    .string()
    .trim()
    .transform((v) => v.toLowerCase())
    .array()
    .min(1),
});
