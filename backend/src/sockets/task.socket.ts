import { Server } from "socket.io";

export const registerTaskSocket = (io: Server) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

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
