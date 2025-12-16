import { useQuery } from "@tanstack/react-query";
import { getAssignedTasks, getCreatedTasks, getOverdueTasks } from "../api/task.api";

export const useAssignedTasks = () =>
  useQuery({ queryKey: ["tasks-assigned"], queryFn: getAssignedTasks });

export const useCreatedTasks = () =>
  useQuery({ queryKey: ["tasks-created"], queryFn: getCreatedTasks });

export const useOverdueTasks = () =>
  useQuery({ queryKey: ["tasks-overdue"], queryFn: getOverdueTasks });
