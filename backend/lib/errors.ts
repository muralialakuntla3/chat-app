import { ZodError } from "zod";
import { APIError } from "../src/types";
import logger from "./logger";

export const sanitizeError = (error: unknown): APIError => {
  logger.error(error);
  if (error instanceof ZodError) {
    return { error };
  }

  return {
    error: "Something went wrong, please try again or contact support.",
  };
};
