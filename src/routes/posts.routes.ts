import { Router } from "express";
import {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
} from "../controllers/posts.controllers.js";
import { validateData } from "../middlewares/validationMiddleware.js";
import { postSchema } from "../zod/index.js";

const router = Router();

router.get("/", getAllPosts);
router.get("/:id", getPostById);
router.post("/", validateData(postSchema), createPost);
router.put("/:id", updatePost);
router.delete("/:id", deletePost);

export default router;
