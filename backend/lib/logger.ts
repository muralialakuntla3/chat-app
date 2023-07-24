import pino, { LoggerOptions } from "pino";
import pinoHttp from "pino-http";

const loggerTransportOptions: LoggerOptions["transport"] = {
  target: "pino-pretty",
  options: {
    colorize: true,
  },
};
const logger = pino({
  transport: loggerTransportOptions,
  level: "debug",
});

export function httpLogger() {
  return pinoHttp({
    quietReqLogger: true, // turn off the default logging output
    transport: {
      target: "pino-http-print", // use the pino-http-print transport and its formatting output
      options: {
        destination: 1,
        all: true,
        translateTime: true,
      },
    },
  });
}

export default logger;
