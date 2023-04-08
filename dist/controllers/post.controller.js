"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPost = exports.getPosts = void 0;
const handle_async_1 = __importDefault(require("../helpers/handle.async"));
const prisma_client_1 = __importDefault(require("../helpers/prisma.client"));
const error_handler_1 = require("../helpers/error.handler");
exports.getPosts = (0, handle_async_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const query = Array.isArray(req.query.userId)
        ? req.query.userId[0]
        : req.query.userId;
    let posts;
    if (query) {
        posts = yield prisma_client_1.default.post.findMany({
            where: { authorId: query },
            include: {
                author: {
                    select: { id: true, username: true },
                },
            },
        });
    }
    else {
        posts = yield prisma_client_1.default.post.findMany({
            include: {
                author: {
                    select: { id: true, username: true },
                },
            },
        });
    }
    res.status(200).json(posts);
}));
exports.createPost = (0, handle_async_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, content, image } = req.body;
    let missingFields = [];
    let bodyObject = { title, content, image };
    for (let field in bodyObject) {
        if (!req.body[field])
            missingFields.push(field);
    }
    if (missingFields.length > 0)
        return next(new error_handler_1.GlobalError(`${missingFields.join(", ")} ${missingFields.length > 1 ? "are" : "is"} required`, 400));
    const newPost = yield prisma_client_1.default.post.create({
        data: {
            title,
            content,
            image,
            //@ts-ignore
            authorId: req.user.id,
        },
    });
    res.status(201).json({
        message: "Post created",
        post: newPost,
    });
}));
