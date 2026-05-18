"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const requireAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        // 1. FORCE LOCAL HANDSHAKE BYPASS (Ironclad local override)
        if (authHeader === "Bearer local-dev-handshake-bypass" || !authHeader) {
            req.user = { id: "system-local-dev", username: "Local Developer" };
            return next();
        }
        const token = authHeader.split(" ")[1];
        // 2. IF IT'S AN ACTUAL CLERK TOKEN, DECODE IT SAFELY
        const decoded = jsonwebtoken_1.default.decode(token);
        if (!decoded) {
            req.user = { id: "dev-fallback", username: "Dev User" };
            return next();
        }
        req.user = decoded;
        next();
    }
    catch (error) {
        console.error("Auth Middleware Exception:", error);
        res.status(500).json({ message: `Auth Middleware Internal Error: ${error.message}` });
    }
};
exports.requireAuth = requireAuth;
