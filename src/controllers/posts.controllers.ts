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

  res.status(200).json(posts);
};

export const getPostById = async (
  req: Request<{ id: number }, Post, {}>,
  res: Response,
): Promise<void> => {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    res.status(400).json({ error: "Invalid post id" });
    return;
  }

  const post = await db
    .select()
    .from(postsTable)
    .where(eq(postsTable.id, id))
    .limit(1)
    .then((res) => res[0]);

  if (!post) {
    res.status(404).json({ error: "Post not found" });
    return;
  }

  res.status(200).json(post);
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
  res.status(201).json(newPost);
};

export const updatePost = async (
  req: Request<{ id: number }, Post, Partial<PostBody>, {}>,
  res: Response,
) => {
  const { id } = req.params;
  const { title, content, category, tags } = req.body;
  const [postExist] = await db
    .select()
    .from(postsTable)
    .where(eq(postsTable.id, Number(id)));

  if (!postExist) {
    res.status(404).json({ error: "Post not found" });
    return;
  }

  const [updatedPost] = await db
    .update(postsTable)
    .set({ title: title, content: content, category: category, tags: tags })
    .where(eq(postsTable.id, Number(id)))
    .returning();

  res.status(200).json(updatedPost);
};

export const deletePost = async (
  req: Request<{ id: number }, {}, {}, {}>,
  res: Response,
) => {
  const { id } = req.params;
  const [postExist] = await db
    .select()
    .from(postsTable)
    .where(eq(postsTable.id, Number(id)));

  if (!postExist) {
    res.status(404).json({ error: "Post not found" });
    return;
  }

  const deletedPost = await db
    .delete(postsTable)
    .where(eq(postsTable.id, Number(id)));

  res.sendStatus(204);
};
