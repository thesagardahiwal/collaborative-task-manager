import { Server } from "socket.io";

export const registerTaskSocket = (io: Server) => {
  io.on("connection", (socket) => {
    const userId = socket.handshake.auth.userId;
    if (userId) {
      socket.join(userId);
      console.log(`🔗 User connected: ${userId}`);
    }

    socket.on("disconnect", () => {
      console.log("❌ User disconnected");
    });

    socket.on("taskUpdated", (task) => {
      io.emit("taskUpdated", task);
    });

    socket.on("taskCreated", (task) => {
      io.emit("taskCreated", task);
    });

    socket.on("taskAssigned", (info) => {
      io.emit("taskAssigned", info);
    });
  });
};
