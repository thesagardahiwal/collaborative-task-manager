import { Request, Response, NextFunction } from "express";
import { TaskService } from "../services/task.service";
import { CreateTaskDto } from "../dtos/create-task.dto";
import { UpdateTaskDto } from "../dtos/update-task.dto";
import { AppError } from "../utils/AppError";

const taskService = new TaskService();

export default {

  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = CreateTaskDto.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          status: "error",
          message: "Validation error",
          details: parsed.error
        });
      }

      const task = await taskService.create({
        ...parsed.data,
        creatorId: req.user.id
      });
      
      
      return res.status(201).json({
        status: "success",
        message: "Task created successfully",
        data: { task }
      });
    } catch (err) {
      next(err);
    }
  },

  getAll: async (_: Request, res: Response, next: NextFunction) => {
    try {
      const tasks = await taskService.getAll();

      return res.status(200).json({
        status: "success",
        message: "Tasks fetched successfully",
        data: { tasks }
      });
    } catch (err) {
      next(err);
    }
  },


  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = UpdateTaskDto.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          status: "error",
          message: "Validation error",
          details: parsed.error
        });
      }

      const updated = await taskService.update(req.params.id, parsed.data);

      if (!updated) {
        throw new AppError("Task not found", 404);
      }

      return res.status(200).json({
        status: "success",
        message: "Task updated successfully",
        data: { task: updated }
      });
    } catch (err) {
      next(err);
    }
  },

  delete: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const deleted = await taskService.delete(req.params.id);

      if (!deleted) {
        throw new AppError("Task not found", 404);
      }

      return res.status(200).json({
        status: "success",
        message: "Task deleted successfully"
      });
    } catch (err) {
      next(err);
    }
  },

  getAssignedTasks: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tasks = await taskService.getAssignedTasks(req.user.id);
      return res.status(200).json({
        status: "success",
        message: "Assigned tasks fetched successfully",
        data: { tasks }
      });
    } catch (err) {
      next(err);
    }
  },

  getCreatedTasks: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tasks = await taskService.getCreatedTasks(req.user.id);
      
      return res.status(200).json({
        status: "success",
        message: "Created tasks fetched successfully",
        data: { tasks }
      });
    } catch (err) {
      next(err);
    }
  },

  getOverdueTasks: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tasks = await taskService.getOverdueTasks(req.user.id);

      return res.status(200).json({
        status: "success",
        message: "Overdue tasks fetched successfully",
        data: { tasks }
      });
    } catch (err) {
      next(err);
    }
  }
};
