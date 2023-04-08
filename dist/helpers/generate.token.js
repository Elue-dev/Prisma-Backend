"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAndSendToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES,
    });
};
const generateAndSendToken = ({ user, statusCode, res }) => {
    const accessToken = generateToken(user.id);
    const cookieOptions = {
        expires: new Date(Date.now() + Number(process.env.COOKIE_EXPIRES) * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: false,
    };
    if (process.env.NODE_ENV === "production")
        cookieOptions.secure = true;
    user.password = undefined;
    res
        .cookie("accessToken", accessToken, cookieOptions)
        .status(statusCode)
        .json({
        user,
        accessToken,
    });
};
exports.generateAndSendToken = generateAndSendToken;
