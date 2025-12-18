import { useState } from "react";
import { useTasks } from "../hooks/useTasks";
import { useUsers } from "../hooks/useUsers";
import { 
  MoreVertical, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  UserPlus,
  Trash2,
  Edit2,
  Eye,
  EyeOff,
  Tag,
  User,
  X,
  Loader2
} from "lucide-react";
import type { ITask, IUser } from "../types/task.type";
import { useAuthContext } from "../context/AuthContext";


interface TaskCardProps {
  task: ITask;
}

interface ColorConfig {
  bg: string;
  text: string;
  border: string;
  dot: string;
}

interface StatusColorConfig extends Omit<ColorConfig, "dot"> {
  icon: React.ComponentType<{ className?: string }>;
}

export default function TaskCard({ task }: TaskCardProps) {
  const { updateTaskMutation, deleteTaskMutation } = useTasks();
  const { data: users, isLoading: usersLoading } = useUsers();
  const [editing, setEditing] = useState<boolean>(false);
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const { user } = useAuthContext();
  // Get assignee and creator (check both populated object and ID)
  const assignee = task.assignedToId;
  const creator = task.creatorId;

  const updateTask = (updates: any) => {
    const backendUpdates: any = { ...updates };

    updateTaskMutation.mutate({
      id: task._id,
      data: backendUpdates,
    });
    
    if (editing) {
      setEditing(false);
    }
  };

  const handleDelete = (taskId : string) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      deleteTaskMutation.mutate({
        id: taskId
      });

      if (editing) {
        setEditing(false);
      }
    }
  };

  const getPriorityColor = (priority: ITask["priority"]): ColorConfig => {
    switch (priority) {
      case "Urgent":
        return { 
          bg: "bg-red-50", 
          text: "text-red-700", 
          border: "border-red-200", 
          dot: "bg-red-500" 
        };
      case "High":
        return { 
          bg: "bg-orange-50", 
          text: "text-orange-700", 
          border: "border-orange-200", 
          dot: "bg-orange-500" 
        };
      case "Medium":
        return { 
          bg: "bg-amber-50", 
          text: "text-amber-700", 
          border: "border-amber-200", 
          dot: "bg-amber-500" 
        };
      default:
        return { 
          bg: "bg-blue-50", 
          text: "text-blue-700", 
          border: "border-blue-200", 
          dot: "bg-blue-500" 
        };
    }
  };

  const getStatusColor = (status: ITask["status"]): StatusColorConfig => {
    switch (status) {
      case "Completed":
        return { 
          bg: "bg-emerald-50", 
          text: "text-emerald-700", 
          border: "border-emerald-200", 
          icon: CheckCircle2 
        };
      case "In Progress":
        return { 
          bg: "bg-blue-50", 
          text: "text-blue-700", 
          border: "border-blue-200", 
          icon: Clock 
        };
      case "Review":
        return { 
          bg: "bg-purple-50", 
          text: "text-purple-700", 
          border: "border-purple-200", 
          icon: Eye 
        };
      default:
        return { 
          bg: "bg-gray-50", 
          text: "text-gray-700", 
          border: "border-gray-200", 
          icon: AlertCircle 
        };
    }
  };

  const formatDate = (dateString: string, includeYear: boolean = false): string => {
    if (!dateString) return "No date";
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid date";
    
    const options: Intl.DateTimeFormatOptions = {
      month: 'short',
      day: 'numeric',
    };
    
    if (includeYear) {
      options.year = 'numeric';
    }
    
    return date.toLocaleDateString('en-US', options);
  };

  const priorityColors = getPriorityColor(task.priority);
  const statusColors = getStatusColor(task.status);
  const StatusIcon = statusColors.icon;

  return (
    <div className="group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
      {/* Card Header */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 text-lg truncate pr-2">
              {task.title}
            </h3>
            
            {/* Quick info row */}
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              {/* Priority */}
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${priorityColors.bg} ${priorityColors.text} ${priorityColors.border} border`}>
                <div className={`w-2 h-2 rounded-full ${priorityColors.dot}`} />
                {task.priority}
              </span>
              
              {/* Status */}
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusColors.bg} ${statusColors.text} ${statusColors.border} border`}>
                <StatusIcon className="w-3.5 h-3.5" />
                {task.status}
              </span>
              
              {/* Due date */}
              {task.dueDate && (
                <span className="inline-flex items-center gap-1.5 text-xs text-gray-500">
                  <Calendar className="w-3.5 h-3.5" />
                  {formatDate(task.dueDate)}
                </span>
              )}
            </div>
          </div>
          
          {/* Options Menu */}
          <div className="relative">
            <button
              onClick={() => setShowOptions(!showOptions)}
              onBlur={() => setTimeout(() => setShowOptions(false), 200)}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
              aria-label="Task options"
            >
              <MoreVertical className="w-5 h-5" />
            </button>
            
            {/* Options Dropdown */}
            {showOptions && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50 py-2">
                <button
                  onClick={() => {
                    setShowDetails(!showDetails);
                    setShowOptions(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 text-sm"
                >
                  {showDetails ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  {showDetails ? "Hide Details" : "Show Details"}
                </button>
                <button
                  onClick={() => {
                    setEditing(true);
                    setShowOptions(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 text-sm"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit Task
                </button>
                {task.creatorId._id === user?._id && (
                  <>
                    <div className="border-t my-1" />
                    <button
                      onClick={() => {
                        handleDelete(task._id);
                        setShowOptions(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 text-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete Task
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Description */}
        <p className="text-gray-600 text-sm line-clamp-2 mb-4">
          {task.description || "No description provided"}
        </p>
        
        {/* People Section */}
        <div className="flex md:flex-row flex-col items-center justify-between">
          {/* Assignee & Creator */}
          <div className="flex items-center gap-3">
            {/* Assignee */}
            <div className="flex items-center gap-2">
              {assignee ? (
                <>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs font-semibold">
                    {assignee.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Assigned to</p>
                    <p className="text-sm font-medium text-gray-900 truncate max-w-[100px]">
                      {assignee.name.split(' ')[0]}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                    <UserPlus className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Assignee</p>
                    <p className="text-sm font-medium text-gray-400">Unassigned</p>
                  </div>
                </>
              )}
            </div>
            
            {/* Creator */}
            {creator && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center text-white text-xs font-semibold">
                  {creator.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-xs text-gray-500">Created by</p>
                  <p className="text-sm font-medium text-gray-900 truncate max-w-[100px]">
                    {creator.name.split(' ')[0]}
                  </p>
                </div>
              </div>
            )}
          </div>
          
          {/* Status toggle */}
          <button
            onClick={() => updateTask({ 
              status: task.status === "Completed" ? "To Do" : "Completed" 
            })}
            className={`px-3 w-full mt-4 md:mt-0 md:w-fit py-1.5 rounded-lg text-xs font-medium transition-colors ${
              task.status === "Completed" 
                ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" 
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            disabled={updateTaskMutation.isPending}
          >
            {updateTaskMutation.isPending ? (
              <span className="flex items-center gap-1">
                <Loader2 className="w-3 h-3 animate-spin" />
                Updating...
              </span>
            ) : (
              task.status === "Completed" ? "✓ Done" : "Mark Complete"
            )}
          </button>
        </div>
      </div>
      
      {/* Details Section */}
      {showDetails && (
        <div className="border-t border-gray-100 p-5 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Timestamps */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Timeline
              </h4>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">Created:</span>
                <span className="font-medium text-gray-900">
                  {task.createdAt ? formatDate(task.createdAt, true) : "N/A"}
                </span>
              </div>
              {task.updatedAt && (
                <div className="flex items-center gap-2 text-sm">
                  <Edit2 className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">Updated:</span>
                  <span className="font-medium text-gray-900">
                    {formatDate(task.updatedAt)}
                  </span>
                </div>
              )}
              {task.dueDate && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">Due:</span>
                  <span className="font-medium text-gray-900">
                    {formatDate(task.dueDate, true)}
                  </span>
                </div>
              )}
            </div>
            
            {/* Task Details */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Task Details
              </h4>
              <div className="flex items-center gap-2 text-sm">
                <Tag className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">ID:</span>
                <span className="font-mono text-gray-900 text-xs">
                  {task._id.slice(-8)}
                </span>
              </div>
              {task.tags && task.tags.length > 0 && (
                <div>
                  <span className="text-xs text-gray-600 mb-1 block">Tags:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {task.tags.map((tag: string, index: number) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Edit Form */}
      {editing && (
        <div className="border-t border-gray-100 p-5 bg-gray-50">
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-900">Edit Task</h4>
              <button
                onClick={() => setEditing(false)}
                className="p-1 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            {/* Status */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Status
              </label>
              <select
                value={task.status}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
                  updateTask({ status: e.target.value as ITask["status"] })
                }
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                disabled={updateTaskMutation.isPending}
              >
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Review">Review</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            
            {/* Priority */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Priority
              </label>
              <select
                value={task.priority}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
                  updateTask({ priority: e.target.value as ITask["priority"] })
                }
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                disabled={updateTaskMutation.isPending}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
            
            {/* Assignee */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Assign To
              </label>
              {usersLoading ? (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <User className="w-4 h-4 animate-pulse" />
                  Loading users...
                </div>
              ) : (
                <select
                  value={task.assignedToId?._id || ""}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
                    updateTask({ assignedToId: e.target.value || undefined })
                  }
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  disabled={updateTaskMutation.isPending}
                >
                  <option value="">Unassigned</option>
                  {users?.map((user: IUser) => (
                    <option key={user._id} value={user._id}>
                      {user.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Due Date
              </label>
              <input
                type="date"
                value={task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                  updateTask({ dueDate: e.target.value })
                }
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                disabled={updateTaskMutation.isPending}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}