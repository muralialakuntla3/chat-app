import { RequestHandler } from "express";
import db from "../../../../lib/db";
import { SearchQuerySchema } from "../../../../lib/zod-schemas";

const getUsersListHandler: RequestHandler = async (req, res, next) => {
  const { search } = SearchQuerySchema.parse(req.query);

  let users;
  try {
    users = await db.user.findMany({
      where: search
        ? {
            OR: [
              {
                name: {
                  contains: search,
                  mode: "insensitive",
                },
              },
              {
                email: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            ],
          }
        : undefined,
      select: {
        name: true,
        email: true,
        avatar: true,
        username: true,
      },
    });
  } catch (error) {
    next(error);
    return;
  }

  res.json(users);
};

export default getUsersListHandler;
