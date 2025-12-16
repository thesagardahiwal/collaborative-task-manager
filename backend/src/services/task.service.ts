import { io } from "..";
import { TaskRepository } from "../repositories/task.repository";
import { AppError } from "../utils/AppError";

const taskRepo = new TaskRepository();

export class TaskService {
  create(data: any) {
    return taskRepo.create(data);
  }

  getAll() {
    return taskRepo.findAll();
  }

  async update(id: string, data: any) {
    const task = await taskRepo.update(id, data);
    if (!task) throw new AppError("Task not found", 404);
    // If assignedToId changed → notify the new user
    if (data.assignedToId) {
        console.log("Emitting taskAssigned event via Socket.io");
        io.to(String(data.assignedToId._id)).emit("taskAssigned", {
            taskId: task._id,
            title: task.title,
            assignedToId: data.assignedToId,
            message: `A new task was assigned to you: ${task.title}`
        });
    }
    return task;
  }

  delete(id: string) {
    return taskRepo.delete(id);
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
