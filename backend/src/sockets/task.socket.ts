import { Server } from "socket.io";
export const onlineUsers = new Map<string, Set<string>>();

export const registerTaskSocket = (io: Server) => {
  io.on("connection", (socket) => {
    const userId = socket.handshake.auth.userId;
    if (!userId) return;

    socket.join(userId);
    console.log(`🔗 User connected: ${userId}`);
    if (!onlineUsers.has(userId)) {
      onlineUsers.set(userId, new Set());
    };

    onlineUsers.get(userId)!.add(socket.id);

    socket.on("disconnect", () => {
      onlineUsers.get(userId)?.delete(socket.id);
      if (onlineUsers.get(userId)?.size === 0) {
        onlineUsers.delete(userId);
      }
    });

    socket.on("taskEvent", (task) => {
      io.emit("taskEvent", task);
    });

    socket.on("online-users", () => {
      io.emit("online-users", onlineUsers);
    });
  });
};
