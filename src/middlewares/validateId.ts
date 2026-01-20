import { Request, Response, NextFunction } from "express";
import "dotenv/config";
import { eq } from "drizzle-orm";
import { postsTable } from "../db/schema.js";
import { db } from "../db/index.js";
import { Post } from "../db/schema.js";

export const validateId = async (
  req: Request<{ id: number }>,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid post id." });
  }

  const post: Post = await db
    .select()
    .from(postsTable)
    .where(eq(postsTable.id, id))
    .limit(1)
    .then((res) => res[0]);

  if (post) {
    req.post = post;
    return next();
  } else {
    return res.status(404).json({ error: "Post not found." });
  }
};
