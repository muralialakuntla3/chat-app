import db from "../lib/db";
import logger from "../lib/logger";
import { faker } from "@faker-js/faker";
import { generatePasswordHash } from "../lib/auth-utils";
import { Channel } from "@prisma/client";

async function main() {
  // Create 5 users
  await db.user.createMany({
    data: await Promise.all(
      new Array(5).fill(null).map(async () => ({
        name: faker.name.firstName(),
        email: faker.internet.email(),
        passwordHash: await generatePasswordHash("password"),
        username: faker.internet.userName(),
        avatar: faker.internet.avatar(),
      }))
    ),
  });
  const users = await db.user.findMany({
    select: {
      username: true,
    },
  });
  logger.info("5 users created", users);

  // Create 5 channels
  const channels: Channel[] = [];
  for (let index = 0; index < 5; index++) {
    try {
      channels.push(
        await db.channel.create({
          data: {
            name: faker.name.firstName(),
            users: {
              connect: users,
            },
          },
        })
      );
    } catch (error) {
      logger.warn(error);
      continue;
    }
  }
  logger.info("5 channels created", channels);
}

main().catch((error) => {
  logger.error(error);
});
