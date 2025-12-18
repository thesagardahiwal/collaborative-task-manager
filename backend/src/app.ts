import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";

import { connectDB } from "./config/database";
import authRoutes from "./routes/auth.routes";
import taskRoutes from "./routes/task.routes";
import userRoutes from "./routes/user.routes";

dotenv.config();
connectDB();

const app = express();

app.use(cors({
  origin: [process.env.CLIENT_URL || "http://localhost:5173", "http://localhost:5173"],
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes);

export default app;
