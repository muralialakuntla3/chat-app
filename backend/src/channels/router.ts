import { Router } from "express";
import validator from "../../lib/middleware/validator";
import { ChannelNameParamsSchema } from "../../lib/zod-schemas";
import channelHandlers from "./handlers";
import { CreateChannelDataSchema } from "./zod-schemas";

const channelsRouter = Router();

channelsRouter
  .route("/")
  .get(channelHandlers.getChannelsHandler)
  .post(
    validator(CreateChannelDataSchema),
    channelHandlers.createChannelHandler
  );

channelsRouter
  .route("/:channelName")
  .all(validator(ChannelNameParamsSchema, "params"))
  .get(channelHandlers.getChannelHandler)
  .delete(channelHandlers.deleteChannelHandler);

export default channelsRouter;
