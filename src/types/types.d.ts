import { postsTable } from "../db/schema.ts";

type Post = typeof postsTable.$inferSelect;

declare global {
  namespace Express {
    interface Request {
      post?: Post;
    }
  }

  interface Error {
    status?: number;
    statusCode?: number;
  }
}
