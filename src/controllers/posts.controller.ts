import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import { sql } from 'drizzle-orm';
import { postsTable } from '../db/schema.js';
import { Request, Response } from "express";

const db = drizzle(process.env.DATABASE_URL!);

export const getAllPosts = async (request: Request, response: Response) => {
  try {
    const termParam = request.query.term;
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
        `
      );
      posts = result.rows;
    } else {
      posts = await db.select().from(postsTable);
    }

    response.status(200).json(posts);

  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    response.status(500).json({ error: message });
  }
};

export const getPostById = async (request: Request, response: Response): Promise<void> => {
  try {
    const id = Number(request.params.id);

    if (Number.isNaN(id)) {
      response.status(400).json({ error: "Invalid post id" });
      return;
    }

    const post = await db
      .select()
      .from(postsTable)
      .where(eq(postsTable.id, id))
      .limit(1)
      .then(res => res[0]);

    if (!post) {
      response.status(404).json({ error: "Post not found" });
      return;
    }

    response.status(200).json(post);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    response.status(500).json({ error: message });
  }
};

export const createPost = async (request: Request, response: Response) => {
  try {
    const { title, content, category, tags } = request.body;

    const newPost = await db.insert(postsTable).values({ title: title, content: content, category: category, tags: tags }).returning();
    response.status(201).json(newPost);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    response.status(400).json({ error: message });
  }
};