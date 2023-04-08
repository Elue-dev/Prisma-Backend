"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.route("/").get(auth_middleware_1.verifyAuth, user_controller_1.getUsers);
router.route("/:userId").get(user_controller_1.getUser);
exports.default = router;
