import { drizzle } from "drizzle-orm/node-postgres";
import { eq, sql } from "drizzle-orm";
import { postsTable } from "../db/schema.js";
import { Request, Response } from "express";
import { Post, PostBody } from "../interfaces/index.js";

const db = drizzle(process.env.DATABASE_URL!);

export const getAllPosts = async (
  req: Request<{}, Post[], {}, { term?: string }>,
  res: Response,
) => {
  const termParam = req.query.term;
  const term = typeof termParam === "string" ? termParam : undefined;

  let posts;
  if (term) {
    const result = await db.execute(
      sql`
          SELECT *
          FROM ${postsTable}
          WHERE to_tsvector(
            'spanish',
            ${postsTable.title} || ' ' || ${postsTable.content} || ' ' || ${postsTable.category}
          ) @@ to_tsquery('spanish', ${term})
        `,
    );
    posts = result.rows;
  } else {
    posts = await db.select().from(postsTable);
  }

  return res.status(200).json(posts);
};

export const getPostById = async (
  req: Request<{ id: number }, Post, {}>,
  res: Response,
) => {
  const post = req.post;
  return res.status(200).json(post);
};

export const createPost = async (
  req: Request<{}, Post, PostBody, {}>,
  res: Response,
) => {
  const { title, content, category, tags } = req.body;

  const [newPost] = await db
    .insert(postsTable)
    .values({
      title: title,
      content: content,
      category: category,
      tags: tags,
    })
    .returning();

  return res.status(201).json(newPost);
};

export const updatePost = async (
  req: Request<{ id: number }, Post, Partial<PostBody>, {}>,
  res: Response,
) => {
  const id = Number(req.params.id);
  const { title, content, category, tags } = req.body;

  const [updatedPost] = await db
    .update(postsTable)
    .set({ title: title, content: content, category: category, tags: tags })
    .where(eq(postsTable.id, id))
    .returning();

  return res.status(200).json(updatedPost);
};

export const deletePost = async (
  req: Request<{ id: number }, {}, {}, {}>,
  res: Response,
) => {
  const id = Number(req.params.id);
  const [postExist] = await db
    .select()
    .from(postsTable)
    .where(eq(postsTable.id, id));

  if (!postExist) {
    return res.status(404).json({ error: "Post not found" });
  }

  const deletedPost = await db.delete(postsTable).where(eq(postsTable.id, id));

  return res.sendStatus(204);
};
