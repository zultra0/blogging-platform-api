import { eq, Update } from "drizzle-orm";
import { postsTable } from "../db/schema.js";
import { Request, Response } from "express";
import { Post, NewPost, UpdatePost } from "../db/schema.js";
import { db } from "../db/index.js";
import { ftsSearch } from "../db/utils.js";

export const getAllPosts = async (
  req: Request<{}, Post[], {}, { term?: string }>,
  res: Response,
): Promise<Response> => {
  const term: string | undefined = typeof req.query.term === "string" ? req.query.term : undefined;

  const posts: Post[] = term
    ? await db
        .select()
        .from(postsTable)
        .where(
          ftsSearch(
            [postsTable.title, postsTable.content, postsTable.category],
            term,
          ),
        )
    : await db.select().from(postsTable);

  return res.status(200).json(posts);
};

export const getPostById = async (
  req: Request<{ id: number }, Post, {}>,
  res: Response,
): Promise<Response> => {
  const post: Post | undefined = req.post;
  return res.status(200).json(post);
};

export const createPost = async (
  req: Request<{}, Post, NewPost, {}>,
  res: Response,
): Promise<Response> => {
  const newPost: Post = await db
    .insert(postsTable)
    .values(req.body)
    .returning()
    .then((res) => res[0]);

  return res.status(201).json(newPost);
};

export const updatePost = async (
  req: Request<{ id: number }, Post, UpdatePost, {}>,
  res: Response,
): Promise<Response> => {
  const id: number = Number(req.params.id);
  const updatedPost: Post = await db
    .update(postsTable)
    .set(req.body)
    .where(eq(postsTable.id, id))
    .returning()
    .then((res) => res[0]);

  return res.status(200).json(updatedPost);
};

export const deletePost = async (
  req: Request<{ id: number }, {}, {}, {}>,
  res: Response,
): Promise<Response> => {
  const id: number = Number(req.params.id);
  const deletedPost: Post = await db
    .delete(postsTable)
    .where(eq(postsTable.id, id))
    .returning()
    .then((res) => res[0]);

  return res.sendStatus(204);
};
