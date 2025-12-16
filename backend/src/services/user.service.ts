import { UserRepository } from "../repositories/user.repository";
import { AppError } from "../utils/AppError";

const userRepo = new UserRepository();

export class UserService {
  getAllUsers() {
    return userRepo.findAll();
  }
  async getProfile(userId: string) {
    const user = await userRepo.findById(userId);
    if (!user) throw new AppError("User not found", 404);

    return {
      _id: user._id,
      name: user.name,
      email: user.email
    };
  }

  async updateProfile(userId: string, updates: any) {
    const user = await userRepo.update(userId, updates);
    if (!user) throw new AppError("Update failed", 400);

    return {
      _id: user._id,
      name: user.name,
      email: user.email
    };
  }
}
