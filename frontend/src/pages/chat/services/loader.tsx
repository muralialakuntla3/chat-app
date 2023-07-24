import { generatePath, LoaderFunction } from "react-router-dom";
import http from "../../../lib/http";
import { ChatPageParamsSchema } from "../../../lib/zod-schemas";
import { ChannelWithUsers, User } from "../../../types";

export const loader: LoaderFunction = async ({ params }) => {
  const validatedParams = ChatPageParamsSchema.parse(params);
  const url =
    validatedParams.chatType === "dm"
      ? generatePath("/users/:username", {
          username: validatedParams.name,
        })
      : generatePath("/channels/:channelName", {
          channelName: validatedParams.name,
        });
  const res = await http.get<(User | ChannelWithUsers)[]>(url);
  return res.data;
};
