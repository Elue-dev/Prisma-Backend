import { tokenArgs } from "../models/auth.model";
import jwt from "jsonwebtoken";

const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

export const generateAndSendToken = ({ user, statusCode, res }: tokenArgs) => {
  const accessToken = generateToken(user.id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + Number(process.env.COOKIE_EXPIRES) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: false,
  };

  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  user.password = undefined;

  res
    .cookie("accessToken", accessToken, cookieOptions)
    .status(statusCode)
    .json({
      user,
      accessToken,
    });
};
