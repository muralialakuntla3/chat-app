import { z } from "zod";

export const ChatTypeSchema = z.enum(["dm", "channel"]).optional();

export const MessagesPaginationCursorSchema = z
  .object({
    chatType: z.literal("dm"),
    messageId: z.string().nullable(),
    username: z.string(),
  })
  .or(
    z.object({
      chatType: z.literal("channel"),
      messageId: z.string().nullable(),
      channelName: z.string(),
    })
  );

export const CreateMessageSchema = z
  .object({
    chatType: z.literal("dm"),
    text: z.string().min(1),
    username: z.string().min(6),
  })
  .or(
    z.object({
      chatType: z.literal("channel"),
      text: z.string().min(1),
      channelName: z.string().min(6),
    })
  );
