import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTasks, createTask, updateTask } from "../api/task.api";
import { socket } from "../utils/socket";

export const useTasks = () => {
  const client = useQueryClient();
    
  
  const tasksQuery = useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks
  });

  // Socket listeners for real-time updates
  socket.on("taskUpdated", () => client.invalidateQueries({ queryKey: ["tasks"] }));
  socket.on("taskCreated", () => client.invalidateQueries({ queryKey: ["tasks"] }));

  const createTaskMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => client.invalidateQueries({ queryKey: ["tasks"] })
  });

  const updateTaskMutation = useMutation<any, unknown, { id: string; data: any }>({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateTask(id, data),
    onSuccess: () => client.invalidateQueries({ queryKey: ["tasks"] })
  });

  return {
    tasksQuery,
    createTaskMutation,
    updateTaskMutation
  };
};
