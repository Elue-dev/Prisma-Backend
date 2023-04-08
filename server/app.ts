import express, { json } from "express";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes";
import userRouter from "./routes/user.routes";
import postRouter from "./routes/posts.routes";
import errorHandler from "./controllers/error.controller";
import { GlobalError } from "./helpers/error.handler";

const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

app.use(json());
app.use(cookieParser());

app.use((req, res, next) => {
  next();
});

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/posts", postRouter);

app.all("*", (req, res, next) => {
  next(new GlobalError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(errorHandler);

export default app;
