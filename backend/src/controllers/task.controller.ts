import { Request, Response } from "express";
import { TaskService } from "../services/task.service";
import { CreateTaskDto } from "../dtos/create-task.dto";
import { UpdateTaskDto } from "../dtos/update-task.dto";

const taskService = new TaskService();

export default {
  create: async (req: Request, res: Response) => {
    const parsed = CreateTaskDto.safeParse(req.body);
    if (!parsed.success) return res.status(400).json(parsed.error);

    const task = await taskService.create({
      ...parsed.data,
      creatorId: req.user.id
    });

    res.json(task);
  },

  getAll: async (_: Request, res: Response) => {
    const tasks = await taskService.getAll();
    res.json(tasks);
  },

  update: async (req: Request, res: Response) => {
    const parsed = UpdateTaskDto.safeParse(req.body);
    if (!parsed.success) return res.status(400).json(parsed.error);

    const updated = await taskService.update(req.params.id, parsed.data);
    res.json(updated);
  },

  delete: async (req: Request, res: Response) => {
    await taskService.delete(req.params.id);
    res.json({ message: "Deleted" });
  }
};
