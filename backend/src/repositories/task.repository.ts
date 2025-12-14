import { TaskModel } from "../models/task.model";

export class TaskRepository {
  create(data: any) {
    return TaskModel.create(data);
  }

  findAll() {
    return TaskModel.find().populate("creatorId assignedToId");
  }

  findById(id: string) {
    return TaskModel.findById(id);
  }

  update(id: string, data: any) {
    return TaskModel.findByIdAndUpdate(id, data, { new: true });
  }

  delete(id: string) {
    return TaskModel.findByIdAndDelete(id);
  }
}
