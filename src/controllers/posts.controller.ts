import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { eq } from "drizzle-orm";
import { sql } from "drizzle-orm";
import { postsTable } from "../db/schema.js";
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

export const getPostById = async (
  request: Request,
  response: Response
): Promise<void> => {
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
      .then((res) => res[0]);

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

export const createPost = async (
  request: Request,
  response: Response
): Promise<void> => {
  try {
    const { title, content, category, tags } = request.body;

    if (!title || title.trim() === "") {
      response.status(400).json({ error: "The title field is empty." });
      return;
    }

    if (!content || content.trim() === "") {
      response.status(400).json({ error: "The content field is empty." });
      return;
    }

    if (!category || category.trim() === "") {
      response.status(400).json({ error: "The category field is empty." });
      return;
    }

    if (!tags) {
      response.status(400).json({ error: "The tags field is empty." });
      return;
    }

    for (const tag of tags) {
      if (tag.trim() === "") {
        response.status(400).json({ error: "Tags cannot be empty strings." });
        return;
      }
    }

    const newPost = await db
      .insert(postsTable)
      .values({
        title: title,
        content: content,
        category: category,
        tags: tags,
      })
      .returning();
    response.status(201).json(newPost);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    response.status(400).json({ error: message });
  }
};

export const updatePost = async (request: Request, response: Response) => {
  try {
    const { id } = request.params;
    const { title, content, category, tags } = request.body;
    const [postExist] = await db
      .select()
      .from(postsTable)
      .where(eq(postsTable.id, Number(id)));

    if (!title || title.trim() === "") {
      response.status(400).json({ error: "The title field is empty." });
      return;
    }

    if (!content || content.trim() === "") {
      response.status(400).json({ error: "The content field is empty." });
      return;
    }

    if (!category || category.trim() === "") {
      response.status(400).json({ error: "The category field is empty." });
      return;
    }

    if (!tags) {
      response.status(400).json({ error: "The tags field is empty." });
      return;
    }

    for (const tag of tags) {
      if (tag.trim() === "") {
        response.status(400).json({ error: "Tags cannot be empty strings." });
        return;
      }
    }

    if (!postExist) {
      response.status(404).json({ error: "Post not found" });
      return;
    }

    const updatedPost = await db
      .update(postsTable)
      .set({ title: title, content: content, category: category, tags: tags })
      .where(eq(postsTable.id, Number(id)))
      .returning();

    response.status(200).json(updatedPost);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    response.status(400).json({ error: message });
  }
};

export const deletePost = async (request: Request, response: Response) => {
  try {
    const { id } = request.params;

    const deletedPost = await db
      .delete(postsTable)
      .where(eq(postsTable.id, Number(id)));

    response.sendStatus(204);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    response.status(400).json({ error: message });
  }
};
