import { TaskModel } from "../models/task.model";

export class TaskRepository {
  create(data: any) {
    return TaskModel.create(data);
  }

  findAll({ sortBy, order }: { sortBy: string; order: 1 | -1 }) {
    return TaskModel.find()
      .sort({ [sortBy]: order })
      .populate("creatorId assignedToId");
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

  findOverdue(
    userId: string,
    sortOrder: "asc" | "desc" = "asc"
  ) {
    return TaskModel.find({
      status: { $ne: "Completed" },
      dueDate: { $lt: new Date() }
    })
      .sort({ dueDate: sortOrder === "asc" ? 1 : -1 })
      .populate("creatorId assignedToId");
  }
}
