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

export interface BaseTaskEvent {
  type: TaskEventType;
  taskId: string;
  title: string;
  timestamp?: number; // optional, frontend can add
}

export type TaskEventType =
  | "TASK_CREATED"
  | "TASK_ASSIGNED"
  | "TASK_UPDATED"
  | "TASK_DELETED";


export interface TaskCreatedEvent extends BaseTaskEvent {
  type: "TASK_CREATED";
  creatorId: string;
  assignedToId: string | null;
}

export interface TaskAssignedEvent extends BaseTaskEvent {
  type: "TASK_ASSIGNED";
  assignedToId: string;
  assignedById: string;
}

export interface TaskUpdatedEvent extends BaseTaskEvent {
  type: "TASK_UPDATED";
  changes: {
    status?: string;
    priority?: string;
    assignedToId?: string;
  };
  updatedById: string;
}

export interface TaskDeletedEvent extends BaseTaskEvent {
  type: "TASK_DELETED";
  deletedById: string;
  assignedToId: string | null;
}

export interface TaskNotification {
  id: string;              // client-generated
  type: TaskEventType;
  taskId: string;
  title: string;
  timestamp: number;

  // Optional metadata
  assignedToId?: string;
  assignedById?: string;
  creatorId?: string;
  deletedById?: string;
  changes?: {
    status?: string;
    priority?: string;
    assignedToId?: string;
  };
}