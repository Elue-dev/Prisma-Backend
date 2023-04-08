"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUser = exports.getUsers = void 0;
const handle_async_1 = __importDefault(require("../helpers/handle.async"));
const prisma_client_1 = __importDefault(require("../helpers/prisma.client"));
const error_handler_1 = require("../helpers/error.handler");
exports.getUsers = (0, handle_async_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield prisma_client_1.default.user.findMany();
    res.status(200).json(users);
}));
exports.getUser = (0, handle_async_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_client_1.default.user.findUnique({
        where: {
            id: req.params.userId,
        },
    });
    if (!user)
        return next(new error_handler_1.GlobalError("User not found.", 404));
    res.status(200).json(user);
}));
