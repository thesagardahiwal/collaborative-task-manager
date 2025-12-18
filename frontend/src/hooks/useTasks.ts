import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTasks, createTask, updateTask, deleteTask } from "../api/task.api";
import { useSocket } from "../context/SocketContext";
import { useEffect, useState } from "react";
export interface SortOption {
  field: 'dueDate';
  order: 'asc' | 'desc';
}

export interface TaskFilters {
  status: string;
  priority: string;
  search: string;
  sort: SortOption;
}


export const useTasks = () => {
  const client = useQueryClient();
  const socket = useSocket();
  const [sort, setSort] = useState<{ field: string; order: 'asc' | 'desc' }>({
    field: 'dueDate',
    order: 'asc'
  });
  const tasksQuery = useQuery({
    queryKey: ["tasks", sort],
    queryFn: () => getTasks(sort)
  });

  const updateSort = (sort: { field: string; order: 'asc' | 'desc' }) => {
    setSort(sort);
  };


  useEffect(() => {
    if (!socket) return;
    socket.on("taskEvent", () => client.invalidateQueries({ queryKey: ["tasks", sort] }));

    return () => {
      socket.off("taskEvent");
    }
  }, [socket]);
  // Socket listeners for real-time updates

  const createTaskMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => client.invalidateQueries({ queryKey: ["tasks", sort] })
  });

  const updateTaskMutation = useMutation<any, unknown, { id: string; data: any }>({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateTask(id, data),
    onSuccess: () => client.invalidateQueries({ queryKey: ["tasks", sort] })
  });

  const deleteTaskMutation = useMutation<any, unknown, {id: string}> ({
    mutationFn: ({id} : {id: string}) => deleteTask(id),
    onSuccess: () => client.invalidateQueries({ queryKey : ["task", sort]})
  })

  return {
    tasksQuery,
    createTaskMutation,
    updateTaskMutation,
    deleteTaskMutation,
    updateSort
  };
};
