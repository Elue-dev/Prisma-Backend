"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const prisma_client_1 = __importDefault(require("./helpers/prisma.client"));
process.on("uncaughtException", (err) => {
    console.log(err.name, err.message);
    console.log("UNCAUGHT EXCEPTION ⛔️, Shutting down...");
    process.exit(1);
});
const PORT = process.env.PORT || 8080;
let server;
prisma_client_1.default
    .$connect()
    .then(() => {
    console.log("Prisma is connected");
    server = app_1.default.listen(PORT, () => console.log(`Backend server running on port ${PORT}`));
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
