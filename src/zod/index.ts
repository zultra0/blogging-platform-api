import * as z from "zod";

export const postSchema = z.object({
  title: z.string().min(5).max(100),
  content: z.string().min(20),
  category: z.string().min(2),
  tags: z.array(z.string().min(2)).min(1),
});

export type PostBody = z.infer<typeof postSchema>;
