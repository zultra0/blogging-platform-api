import { Router } from "express";
import {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
} from "../controllers/posts.controllers.js";
import { validateData } from "../middlewares/validationMiddleware.js";
import { createPostSchema, updatePostSchema } from "../zod/index.js";

const router = Router();

router.get("/", getAllPosts);
router.get("/:id", getPostById);
router.post("/", validateData(createPostSchema), createPost);
router.put("/:id", validateData(updatePostSchema), updatePost);
router.delete("/:id", deletePost);

export default router;
