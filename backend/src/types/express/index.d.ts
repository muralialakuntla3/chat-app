import { SafeUser } from "..";
import "express";

declare global {
  namespace Express {
    interface Request {
      user: SafeUser;
    }
  }
}
