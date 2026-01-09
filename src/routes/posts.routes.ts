import { Router } from "express";
import {
  getAllPosts,
  getPostById,
  createPost,
} from "../controllers/posts.controller.js" ;

const router = Router();

router.get("/", getAllPosts);
router.get("/:id", getPostById);
router.post("/", createPost);

export default router;