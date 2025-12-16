import { api } from "./axiosClient";

export const getTasks = async () => {
  const res = await api.get("/tasks");
  return res.data;
};

export const createTask = async (data: any) => {
  const res = await api.post("/tasks", data);
  return res.data;
};

export const updateTask = async (id: string, data: any) => {
  const res = await api.patch(`/tasks/${id}`, data);
  return res.data;
};

export const getAssignedTasks = async () => {
  return api.get("/tasks/assigned").then(res => res.data.data.tasks);
};

export const getCreatedTasks = async () => {
  return api.get("/tasks/created").then(res => res.data.data.tasks);
};

export const getOverdueTasks = async () => {
  return api.get("/tasks/overdue").then(res => res.data.data.tasks);
};
