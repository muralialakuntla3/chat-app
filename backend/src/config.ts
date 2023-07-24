import { z } from "zod";
import * as dotenv from "dotenv";
import { EmailQueryParamsSchema, NumberStringSchema } from "../lib/zod-schemas";

// Load env variables
dotenv.config();

const configSchema = z.object({
  PORT: NumberStringSchema.default("7000"),
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string(),
  SENDGRID_API_KEY: z.string(),
  FRONTEND_URL: z.string().url().default("http://localhost:5173"),
  SENDGRID_FROM_EMAIL: EmailQueryParamsSchema.shape.email,
  OPENAI_API_KEY: z.string().optional(),
  NODE_ENV: z.enum(["development", "production"]).default("production"),
});

export type Config = z.infer<typeof configSchema>;

export const config = configSchema.parse(process.env);
