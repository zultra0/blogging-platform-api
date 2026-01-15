import { drizzle } from "drizzle-orm/node-postgres";
import { eq, sql } from "drizzle-orm";
import { postsTable } from "../db/schema.js";
import { Request, Response } from "express";
import { Post, PostBody } from "../interfaces/index.js";
import { StatusCodes } from "http-status-codes";

const db = drizzle(process.env.DATABASE_URL!);

export const getAllPosts = async (
  request: Request<{}, Post[], {}, { term?: string }>,
  response: Response
) => {
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

    response.status(StatusCodes.OK).json(posts);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: message });
  }
};

export const getPostById = async (
  request: Request<{ id: number }, Post, {}>,
  response: Response
): Promise<void> => {
  try {
    const id = Number(request.params.id);

    if (Number.isNaN(id)) {
      response
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Invalid post id" });
      return;
    }

    const post = await db
      .select()
      .from(postsTable)
      .where(eq(postsTable.id, id))
      .limit(1)
      .then((res) => res[0]);

    if (!post) {
      response.status(StatusCodes.NOT_FOUND).json({ error: "Post not found" });
      return;
    }

    response.status(StatusCodes.OK).json(post);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: message });
  }
};

export const createPost = async (
  request: Request<{}, Post, PostBody, {}>,
  response: Response
) => {
  try {
    const { title, content, category, tags } = request.body;

    const [newPost] = await db
      .insert(postsTable)
      .values({
        title: title,
        content: content,
        category: category,
        tags: tags,
      })
      .returning();
    response.status(StatusCodes.CREATED).json(newPost);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    response.status(StatusCodes.BAD_REQUEST).json({ error: message });
  }
};

export const updatePost = async (
  request: Request<{ id: number }, Post, Partial<PostBody>, {}>,
  response: Response
) => {
  try {
    const { id } = request.params;
    const { title, content, category, tags } = request.body;
    const [postExist] = await db
      .select()
      .from(postsTable)
      .where(eq(postsTable.id, Number(id)));

    if (!postExist) {
      response.status(StatusCodes.NOT_FOUND).json({ error: "Post not found" });
      return;
    }

    const [updatedPost] = await db
      .update(postsTable)
      .set({ title: title, content: content, category: category, tags: tags })
      .where(eq(postsTable.id, Number(id)))
      .returning();

    response.status(StatusCodes.OK).json(updatedPost);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    response.status(StatusCodes.BAD_REQUEST).json({ error: message });
  }
};

export const deletePost = async (
  request: Request<{ id: number }, {}, {}, {}>,
  response: Response
) => {
  try {
    const { id } = request.params;
    const [postExist] = await db
      .select()
      .from(postsTable)
      .where(eq(postsTable.id, Number(id)));

    if (!postExist) {
      response.status(StatusCodes.NOT_FOUND).json({ error: "Post not found" });
      return;
    }

    const deletedPost = await db
      .delete(postsTable)
      .where(eq(postsTable.id, Number(id)));

    response.sendStatus(StatusCodes.NO_CONTENT);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    response.status(StatusCodes.BAD_REQUEST).json({ error: message });
  }
};
