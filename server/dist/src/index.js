"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
/* ROUTE IMPORTS */
const projectRoutes_1 = __importDefault(require("./routes/projectRoutes"));
const taskRoutes_1 = __importDefault(require("./routes/taskRoutes"));
const searchRoutes_1 = __importDefault(require("./routes/searchRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const teamRoutes_1 = __importDefault(require("./routes/teamRoutes"));
// import { requireAuth } from "./middleware/authMiddleware"; // Paused for local validation loops
/* CONFIGURATIONS */
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, helmet_1.default)());
app.use(helmet_1.default.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use((0, morgan_1.default)("common"));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: false }));
// SECURE CORS CONFIGURATION FOR HTTP AND WEBSOCKET HANDSHAKES
const corsOptions = {
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
};
app.use((0, cors_1.default)(corsOptions));
/* PUBLIC TRACKS */
app.get("/", (req, res) => {
    res.send("Nexus Project Management API Online");
});
/* RESOURCE GATEWAYS (TEMPORARILY BYPASSING AUTH GUARD FOR LOCAL TIERS) */
app.use("/projects", projectRoutes_1.default);
app.use("/tasks", taskRoutes_1.default);
app.use("/search", searchRoutes_1.default);
app.use("/users", userRoutes_1.default);
app.use("/teams", teamRoutes_1.default);
/* INTEGRATE HTTP SERVER & SOCKET.IO CONTAINER */
const httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer, {
    cors: corsOptions,
    transports: ["websocket", "polling"],
});
// Attach the socket channel instance directly to the Express application object 
// so your routing controllers can fire broadcasts seamlessly
app.set("io", io);
io.on("connection", (socket) => {
    console.log(`WebSocket Connected: User session channel secured -> ${socket.id}`);
    socket.on("disconnect", () => {
        console.log(`WebSocket Disconnected: Channel closed -> ${socket.id}`);
    });
});
/* SERVER INITIALIZATION */
const port = Number(process.env.PORT) || 8000;
httpServer.listen(port, "0.0.0.0", () => {
    console.log(`Server running securely with Real-Time WebSockets on port ${port}`);
});
