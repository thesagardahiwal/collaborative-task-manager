import { Schema, model } from "mongoose";

export interface ITask {
  title: string;
  description?: string;
  dueDate: Date;
  priority: "Low" | "Medium" | "High" | "Urgent";
  status: "To Do" | "In Progress" | "Review" | "Completed";
  creatorId: Schema.Types.ObjectId;
  assignedToId?: Schema.Types.ObjectId;
}

const TaskSchema = new Schema({
  title: { type: String, required: true, maxlength: 100 },
  description: { type: String },
  dueDate: { type: Date, required: true },

  priority: {
    type: String,
    enum: ["Low", "Medium", "High", "Urgent"],
    default: "Low"
  },

  status: {
    type: String,
    enum: ["To Do", "In Progress", "Review", "Completed"],
    default: "To Do"
  },

  creatorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  assignedToId: { type: Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

export const TaskModel = model("Task", TaskSchema);
