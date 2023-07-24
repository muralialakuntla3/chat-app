import http from "../http";
import { Channel } from "../../types/index";
import { handleAPIError } from "../errors";

export async function getChannelsList() {
  try {
    const res = await http.get<Channel[]>("/channels");
    return res.data;
  } catch (error) {
    handleAPIError(error);
    return [];
  }
}
