import * as z from "zod";

export const createPostSchema = z.object({
  title: z.string().min(5).max(100),
  content: z.string().min(20),
  category: z.string().min(2),
  tags: z.array(z.string().min(2)).min(1),
});

export const updatePostSchema = z.object({
  title: z.string().min(5).max(100).optional(),
  content: z.string().min(20).optional(),
  category: z.string().min(2).optional(),
  tags: z.array(z.string().min(2)).optional(),
});
