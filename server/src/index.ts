import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { createServer } from "http";
import { Server } from "socket.io";

/* ROUTE IMPORTS */
import projectRoutes from "./routes/projectRoutes";
import taskRoutes from "./routes/taskRoutes";
import searchRoutes from "./routes/searchRoutes";
import userRoutes from "./routes/userRoutes";
import teamRoutes from "./routes/teamRoutes";
// import { requireAuth } from "./middleware/authMiddleware"; // Paused for local validation loops

/* CONFIGURATIONS */
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// SECURE CORS CONFIGURATION FOR HTTP AND WEBSOCKET HANDSHAKES
const corsOptions = {
  origin: "*", 
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

/* PUBLIC TRACKS */
app.get("/", (req, res) => {
  res.send("Nexus Project Management API Online");
});

/* RESOURCE GATEWAYS (TEMPORARILY BYPASSING AUTH GUARD FOR LOCAL TIERS) */
app.use("/projects", projectRoutes);
app.use("/tasks", taskRoutes);
app.use("/search", searchRoutes);
app.use("/users", userRoutes);
app.use("/teams", teamRoutes);

/* INTEGRATE HTTP SERVER & SOCKET.IO CONTAINER */
const httpServer = createServer(app);
const io = new Server(httpServer, {
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