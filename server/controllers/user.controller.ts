import handleAsync from "../helpers/handle.async";
import { NextFunction, Request, Response } from "express";
import prisma from "../helpers/prisma.client";
import { GlobalError } from "../helpers/error.handler";
import { User } from "../models/user.model";

export const getUsers = handleAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await prisma.user.findMany();

    const usersWithoutPasswords = users.map((user: User) => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });

    res.status(200).json({
      result: usersWithoutPasswords.length,
      users: usersWithoutPasswords,
    });
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
    const { password, ...userInfo } = user;
    res.status(200).json(userInfo);
  }
);
