import { Request, Response, NextFunction } from "express";
import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { eq } from "drizzle-orm";
import { postsTable } from "../db/schema.js";
import { db } from "../db/index.js";

export const validateId = async (
  req: Request<{ id: number }>,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid post id." });
  }

  const [post] = await db
    .select()
    .from(postsTable)
    .where(eq(postsTable.id, id));

  if (post) {
    req.post = post;
    return next();
  } else {
    return res.status(404).json({ error: "Post not found." });
  }
};
