import { z } from "zod";
import { ChatTypeSchema, EmailQueryParamsSchema } from "../../lib/zod-schemas";
import {
  CreateMessageSchema,
  MessagesPaginationCursorSchema,
} from "../modules/messaging/zod-schemas";

export interface AuthState {
  user: SafeUser;
  token: string;
}

export interface SafeUser {
  name: string;
  email: string;
  username: string;
  avatar: string | null;
}

export interface APIError {
  error: string | { message: string } | string[] | { message: string }[];
}

export type EmailQueryParam = z.infer<typeof EmailQueryParamsSchema>;

export interface SendEmailOptions {
  to: string;
  from?: string;
  subject: string;
  text: string;
  html?: string;
}

export type MessagesPaginationCursor = z.infer<
  typeof MessagesPaginationCursorSchema
>;

export type CreateMessageData = z.infer<typeof CreateMessageSchema>;

export type ChatType = z.infer<typeof ChatTypeSchema>;
