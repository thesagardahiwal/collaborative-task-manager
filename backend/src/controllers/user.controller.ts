import { Request, Response, NextFunction } from "express";
import { UserService } from "../services/user.service";

const userService = new UserService();

export default {
  getAll: async (_: Request, res: Response, next: NextFunction) => {
    try {
      const users = await userService.getAllUsers();

      return res.status(200).json({
        status: "success",
        message: "Users fetched successfully",
        data: { users }
      });

    } catch (err) {
      next(err);
    }
  },
  getProfile: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await userService.getProfile(req.user.id);

      return res.status(200).json({
        status: "success",
        message: "Profile fetched successfully",
        data: { user }
      });
    } catch (err) {
      next(err);
    }
  },

  updateProfile: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const updated = await userService.updateProfile(req.user.id, req.body);

      return res.status(200).json({
        status: "success",
        message: "Profile updated successfully",
        data: { user: updated }
      });
    } catch (err) {
      next(err);
    }
  }
};
