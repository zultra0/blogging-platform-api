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
import { validateId } from "../middlewares/validateId.js";

const router: Router = Router();

router.get("/", getAllPosts);
router.get("/:id", validateId, getPostById);
router.post("/", validateBody(createPostSchema), createPost);
router.put("/:id", validateId, validateBody(updatePostSchema), updatePost);
router.delete("/:id", validateId, deletePost);

export default router;
