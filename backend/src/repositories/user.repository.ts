import { UserModel } from "../models/user.model";

export class UserRepository {
  findByEmail(email: string) {
    return UserModel.findOne({ email });
  }

  findAll() {
    return UserModel.find().select("-password"); // remove password
  }

  update(id: string, data: any) {
    return UserModel.findByIdAndUpdate(id, data, { new: true }).select("-password");
  }

  create(data: any) {
    return UserModel.create(data);
  }

  findById(id: string) {
    return UserModel.findById(id);
  }
}
