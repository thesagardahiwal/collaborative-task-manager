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

  findByAssignedTo(userId: string) {
    return TaskModel.find({ assignedToId: userId }).sort({ dueDate: 1 }).populate("creatorId assignedToId");
  }

  findByCreator(userId: string) {
    return TaskModel.find({ creatorId: userId }).sort({ dueDate: 1 }).populate("creatorId assignedToId");
  }

  findOverdue(userId: string) {
    return TaskModel.find({
      assignedToId: userId,
      status: { $ne: "Completed" },
      dueDate: { $lt: new Date() }
    }).sort({ dueDate: 1 }).populate("creatorId assignedToId");
  }
}
