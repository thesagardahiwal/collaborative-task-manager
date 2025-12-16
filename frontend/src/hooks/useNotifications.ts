import { useEffect, useState } from "react";
import { socket } from "../utils/socket";

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    socket.on("taskAssigned", (data) => {
        console.log("New task assigned notification:", data);
      setNotifications((prev) => [...prev, data]);
    });

    return () => {
      socket.off("taskAssigned");
    };
  }, []);

  return { notifications };
};
