import { Router } from "express";
import { getUser, getUsers } from "../controllers/user.controller";

const router = Router();

router.route("/").get(getUsers);

router.route("/:userId").get(getUser);

export default router;
