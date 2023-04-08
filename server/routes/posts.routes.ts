import { Router } from "express";
import { createPost, getPosts } from "../controllers/post.controller";
import { verifyAuth } from "../middlewares/auth.middleware";

const router = Router();

router.route("/").get(getPosts).post(verifyAuth, createPost);

router.route("/:userId").get();

export default router;
