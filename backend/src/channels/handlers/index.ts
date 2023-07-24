import createChannelHandler from "./create-channel";
import deleteChannelHandler from "./delete-channel";
import getChannelHandler from "./get-channel";
import getChannelsHandler from "./get-channels";

const channelHandlers = {
  getChannelsHandler,
  getChannelHandler,
  deleteChannelHandler,
  createChannelHandler,
};

export default channelHandlers;
