import { io } from "..";
import { TaskRepository } from "../repositories/task.repository";
import { AppError } from "../utils/AppError";

const taskRepo = new TaskRepository();

export class TaskService {
  async create(data: any) {
    const response = await taskRepo.create(data);
    if (!response) throw new AppError("Falied to create task", 404);
    const task = Array.isArray(response) ? response[0] : response;

    io.emit("taskEvent", {
      type: "TASK_CREATED",
      taskId: task._id,
      title: task.title,
      creatorId: task.creatorId,
      assignedToId: task.assignedToId ?? null,
    });

    if (task.assignedToId) {
      io.emit("taskEvent", {
        type: "TASK_ASSIGNED",
        taskId: task._id,
        title: task.title,
        assignedToId: task.assignedToId,
        assignedById: task.creatorId,
      });
    };

    return task;
  }

  async getAll({ sortBy, order }: { sortBy: string; order: 1 | -1 }) {
    return taskRepo.findAll({sortBy, order});
  }

  async update(id: string, data: any) {
    const oldTask = await taskRepo.findById(id);
    if (!oldTask) throw new AppError("Task not found", 404);
    const response =  await taskRepo.update(id, data);
    if (!response) throw new AppError("Falied to update task", 404);
    const updatedTask = Array.isArray(response) ? response[0] : response;

    // 🔔 TASK UPDATED (broadcast)
    io.emit("taskEvent", {
      type: "TASK_UPDATED",
      taskId: updatedTask._id,
      title: updatedTask.title,
      changes: {
        status: data.status,
        priority: data.priority,
        assignedToId: data.assignedToId,
      },
      updatedById: oldTask.creatorId,
    });

    // 🔔 ASSIGNMENT CHANGE
    if (
      data.assignedToId &&
      data.assignedToId.toString() !== oldTask.assignedToId?.toString()
    ) {
      io.to(data.assignedToId.toString()).emit("taskEvent", {
        type: "TASK_ASSIGNED",
        taskId: updatedTask._id,
        title: updatedTask.title,
        assignedToId: data.assignedToId,
        assignedById: oldTask.creatorId,
      });
    }

    return updatedTask;
  }

  async delete(id: string) {
    const task = await taskRepo.findById(id);
    if (!task) throw new AppError("Task not found", 404);

    await taskRepo.delete(id);

    // 🔔 TASK DELETED (broadcast)
    io.emit("taskEvent", {
      type: "TASK_DELETED",
      taskId: task._id,
      title: task.title,
      deletedById: task.creatorId,
      assignedToId: task.assignedToId ?? null,
    });
  }

  getAssignedTasks(userId: string) {
    return taskRepo.findByAssignedTo(userId);
  }

  getCreatedTasks(userId: string) {
    return taskRepo.findByCreator(userId);
  }

  getOverdueTasks(userId: string) {
    return taskRepo.findOverdue(userId);
  }
}
