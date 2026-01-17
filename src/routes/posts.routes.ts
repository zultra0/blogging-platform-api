import { Router } from "express";
import {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
} from "../controllers/posts.controllers.js";
import { validateBody } from "../middlewares/validateBody.js";
import { createPostSchema, updatePostSchema } from "../zod/index.js";

const router = Router();

router.get("/", getAllPosts);
router.get("/:id", getPostById);
router.post("/", validateBody(createPostSchema), createPost);
router.put("/:id", validateBody(updatePostSchema), updatePost);
router.delete("/:id", deletePost);

export default router;
