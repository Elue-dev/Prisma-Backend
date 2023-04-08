import handleAsync from "../helpers/handle.async";
import { NextFunction, Request, Response } from "express";
import prisma from "../helpers/prisma.client";
import { GlobalError } from "../helpers/error.handler";

export const getUsers = handleAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  }
);

export const getUser = handleAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await prisma.user.findUnique({
      where: {
        id: req.params.userId,
      },
    });

    if (!user) return next(new GlobalError("User not found.", 404));
    res.status(200).json(user);
  }
);
