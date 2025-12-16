export interface IUser {
  _id: string;
  name: string;
  email: string;
  password?: string;
}

// Task interface matching your backend
export interface ITask {
  _id: string;
  title: string;
  description?: string;
  dueDate: string; // Backend expects string for date
  priority: "Low" | "Medium" | "High" | "Urgent";
  status: "To Do" | "In Progress" | "Review" | "Completed";
  creatorId: IUser;
  assignedToId?: IUser;
  createdAt?: string;
  updatedAt?: string;
  tags?: string[];
  comments?: string[];
}