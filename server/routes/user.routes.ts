import { Router } from "express";
import { getUser, getUsers } from "../controllers/user.controller";
import { verifyAuth } from "../middlewares/auth.middleware";

const router = Router();

router.route("/").get(verifyAuth, getUsers);

router.route("/:userId").get(getUser);

export default router;
