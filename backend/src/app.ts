import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import userRouter from "./modules/users/router";
import authenticate from "../lib/middleware/authentication";
import errorHandler from "../lib/middleware/errorHandler";
import swaggerDocument from "../lib/swaggerDocument";
import { httpLogger } from "../lib/logger";
import channelsRouter from "./channels/router";

const app = express();

app.use(express.json());
app.use(httpLogger());
app.use(cors());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use(authenticate());
app.use("/api/v1/users", userRouter);
app.use("/api/v1/channels", channelsRouter);

app.use(errorHandler);

export default app;
