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
exports.login = exports.register = void 0;
const handle_async_1 = __importDefault(require("../helpers/handle.async"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma_client_1 = __importDefault(require("../helpers/prisma.client"));
const error_handler_1 = require("../helpers/error.handler");
exports.register = (0, handle_async_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, username, password } = req.body;
    const userExists = yield prisma_client_1.default.user.findFirst({
        where: {
            email,
        },
    });
    if (userExists)
        return next(new error_handler_1.GlobalError("Email already in use", 400));
    const salt = bcryptjs_1.default.genSaltSync(10);
    const passwordHash = bcryptjs_1.default.hashSync(password, salt);
    yield prisma_client_1.default.user.create({
        data: {
            email,
            username,
            password: passwordHash,
        },
    });
    res.status(201).json("Registration successful");
}));
exports.login = (0, handle_async_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password } = req.body;
    const user = yield prisma_client_1.default.user.findFirst({
        where: {
            OR: [{ username }, { email }],
        },
    });
    if (!user) {
        return next(new error_handler_1.GlobalError("Invalid credentials provided", 400));
    }
    const isPasswordCorrect = bcryptjs_1.default.compareSync(password, user.password);
    if (!isPasswordCorrect) {
        return next(new error_handler_1.GlobalError("Invalid credentials provided", 400));
    }
    res.status(200).json(user);
}));
