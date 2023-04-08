import express, { json } from "express";
import authRouter from "./routes/auth.routes";
import userRouter from "./routes/user.routes";
import errorHandler from "./controllers/error.controller";
import { GlobalError } from "./helpers/error.handler";

const app = express();

app.use(json());

app.use((req, res, next) => {
  next();
});

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);

app.all("*", (req, res, next) => {
  next(new GlobalError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(errorHandler);

export default app;
