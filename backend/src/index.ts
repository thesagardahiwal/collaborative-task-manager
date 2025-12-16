import dotenv from "dotenv";
dotenv.config();

import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";

import { registerTaskSocket } from "./sockets/task.socket";
import app from "./app";

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI!;

// 🔥 Exported here so services can import it
export let io: Server;

const connectWithRetry = () => {
  console.log("MongoDB: Attempting to connect...");

  mongoose
    .connect(MONGO_URI)
    .then(() => {
      console.log("MongoDB Connected Successfully");

      startServer();
    })
    .catch((err) => {
      console.error("MongoDB Connection Failed:", err.message);
      console.log("Retrying in 5 seconds...\n");

      setTimeout(connectWithRetry, 5000);
    });
};

let serverStarted = false;

const startServer = () => {
  if (serverStarted) return;
  serverStarted = true;

  const server = http.createServer(app);

  // ⭐ Assign and export io
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      credentials: true,
    },
  });

  // Register socket listeners
  registerTaskSocket(io);

  server.listen(PORT, () => {
    console.log(`🔥 Server running on port ${PORT}`);
  });

  // Graceful shutdown
  process.on("SIGINT", async () => {
    console.log("Shutting down server...");

    await mongoose.disconnect();
    server.close(() => {
      console.log("Server closed successfully");
      process.exit(0);
    });
  });
};

connectWithRetry();
