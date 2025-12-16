import { useCreatedTasks } from "../../hooks/useDashboardTasks";
import TaskCard from "../../components/TaskCard";
import { Loader2, PlusCircle, FolderPlus, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function CreatedTasks() {
  const { data, isLoading } = useCreatedTasks();

  if (isLoading)
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center p-10">
        <Loader2 className="animate-spin w-12 h-12 text-blue-600 mb-4" />
        <p className="text-gray-600">Loading your created tasks...</p>
      </div>
    );

  const totalTasks = data.length;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
              <FolderPlus className="w-6 h-6" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Tasks I Created</h1>
          </div>
          <p className="text-gray-600">
            Manage and track all tasks you've created
          </p>
        </div>
        
        <Link
          to="/tasks/new"
          className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
        >
          <PlusCircle className="w-5 h-5" />
          Create New Task
        </Link>
      </div>

      {/* Stats Card */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-blue-800 mb-1">Total Created Tasks</p>
            <p className="text-3xl font-bold text-blue-900">{totalTasks}</p>
            <p className="text-sm text-blue-700 mt-2">
              {totalTasks === 0 
                ? "You haven't created any tasks yet" 
                : totalTasks === 1 
                  ? "You've created 1 task" 
                  : `You've created ${totalTasks} tasks`}
            </p>
          </div>
          <div className="p-4 rounded-full bg-white shadow-sm">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white">
              <span className="text-lg font-bold">{totalTasks}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Task List Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Your Created Tasks
          </h2>
          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            {totalTasks} {totalTasks === 1 ? 'task' : 'tasks'}
          </span>
        </div>

        {totalTasks === 0 ? (
          <div className="text-center py-12 px-4 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50">
            <div className="w-16 h-16 mx-auto bg-gray-200 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              No tasks created yet
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Get started by creating your first task. Assign it to team members, set deadlines, and track progress.
            </p>
            <Link
              to="/tasks/new"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
            >
              <PlusCircle className="w-5 h-5" />
              Create Your First Task
            </Link>
          </div>
        ) : (
          <>
            {/* Filters/Sorting - Optional */}
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <p className="text-sm text-gray-600">
                  Showing all {totalTasks} created task{totalTasks !== 1 ? 's' : ''}
                </p>
              </div>
              {/* Add sorting dropdown here if needed */}
            </div>

            {/* Task Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.map((t: any) => (
                <TaskCard key={t._id} task={t} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}