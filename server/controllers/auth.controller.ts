import handleAsync from "../helpers/handle.async";
import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import prisma from "../helpers/prisma.client";
import { GlobalError } from "../helpers/error.handler";
import { generateAndSendToken } from "../helpers/generate.token";

interface userPayload {
  email: string;
  password: string;
  username: string;
}

export const register = handleAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, username, password }: userPayload = req.body;

    const userExists = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (userExists) return next(new GlobalError("Email already in use", 400));

    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);

    await prisma.user.create({
      data: {
        email,
        username,
        password: passwordHash,
      },
    });

    res.status(201).json("Registration successful");
  }
);

export const login = handleAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { username, email, password }: userPayload = req.body;

    const user = await prisma.user.findFirst({
      where: {
        OR: [{ username }, { email }],
      },
    });

    if (!user) {
      return next(new GlobalError("Invalid credentials provided", 400));
    }

    const isPasswordCorrect = bcrypt.compareSync(password, user.password);

    if (!isPasswordCorrect) {
      return next(new GlobalError("Invalid credentials provided", 400));
    }

    generateAndSendToken({ user, statusCode: 200, res });
  }
);
