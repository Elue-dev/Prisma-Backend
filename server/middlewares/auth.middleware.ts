import handleAsync from "../helpers/handle.async";
import { Request, Response, NextFunction } from "express";
import { GlobalError } from "../helpers/error.handler";
import jwt from "jsonwebtoken";
import prisma from "../helpers/prisma.client";
import { AuthenticatedRequest, UserPayload } from "../models/auth.model";
import { User } from "../models/user.model";

export const verifyAuth = handleAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let token;
    let headers = req.headers.authorization;

    if (headers && headers.startsWith("Bearer")) {
      token = headers.split(" ")[1];
    } else if (req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token)
      return next(
        new GlobalError(
          "You are not logged in. Please login to get access",
          401
        )
      );

    try {
      const verifiedToken = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as UserPayload;

      const currentUser: User | null = await prisma.user.findUnique({
        where: { id: verifiedToken.id },
      });

      (req as AuthenticatedRequest).user = currentUser;
    } catch (error) {
      return next(new GlobalError("Session expired. Please log in again", 401));
    }

    next();
  }
);
