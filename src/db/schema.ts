import { InferSelectModel } from "drizzle-orm";
import { pgTable, serial, varchar, text, timestamp } from "drizzle-orm/pg-core";

export const postsTable = pgTable("posts", {
  id: serial().primaryKey().notNull(),
  title: varchar({ length: 255 }).notNull(),
  content: varchar({ length: 10000 }).notNull(),
  category: varchar({ length: 255 }).notNull(),
  tags: text().array().notNull(),
  createdAt: timestamp({ withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp({ withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
});

export type Post = InferSelectModel<typeof postsTable>;
export type NewPost = Pick<Post, "title" | "content" | "category" | "tags">;
export type UpdatePost = Partial<Post>;

