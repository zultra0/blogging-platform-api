import { Router } from "express";
import {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
} from "../controllers/posts.controller.js" ;

const router = Router();

router.get("/", getAllPosts);
router.get("/:id", getPostById);
router.post("/", createPost);
router.put("/:id", updatePost);

export default router;