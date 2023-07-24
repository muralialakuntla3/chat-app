import logger from "../lib/logger";
import { config } from "./config";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import "./socketio"; // Start socket.io server
import httpServer from "./server";

async function main() {
  httpServer.listen(config.PORT, () => {
    logger.info(`🚀 Listening on port ${config.PORT}`);
    logger.info(`API URL: http://localhost:${config.PORT}/api/v1`);
    logger.info(`API Docs URL: http://localhost:${config.PORT}/api-docs`);
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
