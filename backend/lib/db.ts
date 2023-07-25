import { PrismaClient } from "@prisma/client";
import { config } from "../src/config";

const db = new PrismaClient({
  log: config.NODE_ENV === "development" ? ["error",'info','warn'] : ["query"],
});

export default db;
