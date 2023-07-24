import { expressjwt } from "express-jwt";
import { config } from "../../src/config";
import { SocketIOMiddleware } from "../../src/types/socketio";
import { getAuthTokenPayload } from "../auth-utils";
import { pick } from "../util";
import publicRoutes from "../constants/public-routes";

function authenticate() {
  return expressjwt({
    secret: config.JWT_SECRET,
    algorithms: ["HS256"],
    requestProperty: "user",
  }).unless({
    path: publicRoutes,
  });
}

export const authenticateSocket: SocketIOMiddleware = (socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    next(new Error("Auth token not found."));
    return;
  }

  const payload = getAuthTokenPayload(token);

  if (!payload) {
    next(new Error("Invalid auth token."));
    return;
  }

  socket.data.user = pick(payload, ["username", "email", "avatar", "name"]);
  next();
};

export default authenticate;
