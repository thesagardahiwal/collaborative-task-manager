import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuthContext } from "./AuthContext";
import type { TaskNotification } from "../types/task.type";
import { toast } from "react-toastify";

const SocketContext = createContext<Socket | null>(null);
const NotificationContext = createContext<TaskNotification[]>([]);


export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuthContext();
  const socketRef = useRef<Socket | null>(null);
  const [notifications, setNotifications] = useState<TaskNotification[]>([]);

  useEffect(() => {
    if (!user?._id) return;

    // Create socket only AFTER login
    socketRef.current = io("http://localhost:8000", {
      withCredentials: true,
      auth: {
        userId: user._id,
      },
    });

    console.log("🔌 Socket connected for user:", user._id);
    socketRef.current.on("taskEvent", (event : TaskNotification) => {
      if (!user?._id) return;

      let message: string | null = null;
      switch (event.type) {
        case "TASK_CREATED":
          if (event.assignedToId === user._id) {
            message = `A task "${event.title}" was created and assigned to you`;
          }
          break;

        case "TASK_ASSIGNED":
          if (event.assignedToId === user._id) {
            message = `You were assigned a task: "${event.title}"`;
          }
          break;

        case "TASK_UPDATED":
          message = `Task "${event.title}" was updated`;
          break;

        case "TASK_DELETED":
          if (
            event.assignedToId === user._id ||
            event.deletedById === user._id
          ) {
            message = `Task "${event.title}" was deleted`;
          }
          break;
      }

      if (!message) return;

      const notification = {
        id: crypto.randomUUID(),
        taskId: event.taskId,
        message,
      };

      setNotifications((prev) => [
        ...prev,
        {
          ...event,
          id: crypto.randomUUID(),
          timestamp: Date.now(),
        }
      ]);

      toast(notification.message);
    });

    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
      console.log("🔌 Socket disconnected");
    };
  }, [user?._id]); // 🔥 reconnects when user changes

  return (
    <SocketContext.Provider value={socketRef.current}>
      <NotificationContext.Provider value={notifications}>
        {children}
      </NotificationContext.Provider>
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  return useContext(SocketContext);
};

export const useNotification = () => {
  return useContext(NotificationContext);
}
