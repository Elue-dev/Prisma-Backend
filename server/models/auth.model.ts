import { Response, Request } from "express";
import { User } from "./user.model";

export interface tokenArgs {
  user: User;
  statusCode: number;
  res: Response;
}

export interface UserPayload {
  id: string;
  password: string;
}

export interface AuthenticatedRequest extends Request {
  user?: User | null;
}
