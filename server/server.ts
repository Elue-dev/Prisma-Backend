import app from "./app";
import http from "http";
import prisma from "./helpers/prisma.client";

process.on("uncaughtException", (err) => {
  console.log(err.name, err.message);
  console.log("UNCAUGHT EXCEPTION ⛔️, Shutting down...");
  process.exit(1);
});

const PORT = process.env.PORT || 8080;
let server: http.Server;

prisma
  .$connect()
  .then(() => {
    console.log("Prisma is connected");
    server = app.listen(PORT, () =>
      console.log(`Backend server running on port ${PORT}`)
    );
  })
  .catch((error) => {
    console.error("Failed to connect to Prisma:", error);
  });

process.on("unhandledRejection", (err) => {
  console.log(err);
  console.log("UNHANDLED REJECTION ⛔️, Shutting down...");
  server.close(() => {
    process.exit(1);
  });
});
