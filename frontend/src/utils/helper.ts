import type { TaskNotification } from "../types/task.type";

export const getNotificationMessage = (
  n: TaskNotification,
  currentUserId?: string
): string => {
  switch (n.type) {
    case "TASK_CREATED":
      return `Task created: "${n.title}"`;

    case "TASK_ASSIGNED":
      return n.assignedToId === currentUserId
        ? `You were assigned a task: "${n.title}"`
        : `Task "${n.title}" was assigned`;

    case "TASK_UPDATED":
      return `Task updated: "${n.title}"`;

    case "TASK_DELETED":
      return `Task deleted: "${n.title}"`;

    default:
      return "Task updated";
  }
};