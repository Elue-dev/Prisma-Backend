import handleAsync from "../helpers/handle.async";
import { NextFunction, Request, Response } from "express";
import prisma from "../helpers/prisma.client";
import { GlobalError } from "../helpers/error.handler";
import { AuthenticatedRequest } from "../models/auth.model";

export const getPosts = handleAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = Array.isArray(req.query.userId)
      ? req.query.userId[0]
      : req.query.userId;

    let posts;

    if (query) {
      posts = await prisma.post.findMany({
        where: { authorId: query },
        include: {
          author: {
            select: { id: true, username: true },
          },
        },
      });
    } else {
      posts = await prisma.post.findMany({
        include: {
          author: {
            select: { id: true, username: true },
          },
        },
      });
    }

    res.status(200).json(posts);
  }
);

export const createPost = handleAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { title, content, image } = req.body;
    let missingFields = [];
    let bodyObject = { title, content, image };

    for (let field in bodyObject) {
      if (!req.body[field]) missingFields.push(field);
    }

    if (missingFields.length > 0)
      return next(
        new GlobalError(
          `${missingFields.join(", ")} ${
            missingFields.length > 1 ? "are" : "is"
          } required`,
          400
        )
      );

    const newPost = await prisma.post.create({
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
  }
);
