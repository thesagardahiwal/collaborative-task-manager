import { useAssignedTasks } from "../../hooks/useDashboardTasks";
import TaskCard from "../../components/TaskCard";
import { Loader2, UserCheck, Target, CheckCircle, AlertCircle } from "lucide-react";

export default function AssignedTasks() {
  const { data, isLoading } = useAssignedTasks();

  if (isLoading)
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center p-10">
        <Loader2 className="animate-spin w-12 h-12 text-indigo-600 mb-4" />
        <p className="text-gray-600">Loading assigned tasks...</p>
      </div>
    );

  const totalTasks = data.length;
  const completedTasks = data.filter((t: any) => t.status === 'completed').length;
  const pendingTasks = totalTasks - completedTasks;

  return (
    <div className="space-y-6 p-10">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-indigo-100 text-indigo-600">
              <UserCheck className="w-6 h-6" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Assigned to Me</h1>
          </div>
          <p className="text-gray-600">
            Tasks assigned to you by team members
          </p>
        </div>
        
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 font-medium rounded-lg">
          <Target className="w-5 h-5" />
          <span>Your Responsibilities</span>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Tasks */}
        <div className="bg-white border border-indigo-100 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Assigned</p>
              <p className="text-3xl font-bold text-gray-900">{totalTasks}</p>
            </div>
            <div className="p-3 rounded-full bg-indigo-50">
              <UserCheck className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-600">
              {totalTasks === 0 
                ? "No tasks assigned yet" 
                : "Tasks waiting for your attention"}
            </p>
          </div>
        </div>

        {/* Pending Tasks */}
        <div className="bg-white border border-amber-100 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-amber-600 mb-1">Pending</p>
              <p className="text-3xl font-bold text-amber-700">{pendingTasks}</p>
            </div>
            <div className="p-3 rounded-full bg-amber-50">
              <AlertCircle className="w-6 h-6 text-amber-600" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-amber-50">
            <p className="text-sm text-amber-700">
              Need your action
            </p>
          </div>
        </div>

        {/* Completed Tasks */}
        <div className="bg-white border border-emerald-100 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-emerald-600 mb-1">Completed</p>
              <p className="text-3xl font-bold text-emerald-700">{completedTasks}</p>
            </div>
            <div className="p-3 rounded-full bg-emerald-50">
              <CheckCircle className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-emerald-50">
            <p className="text-sm text-emerald-700">
              Great work!
            </p>
          </div>
        </div>
      </div>

      {/* Task List Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Your Tasks
          </h2>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              pendingTasks > 0 
                ? 'bg-amber-100 text-amber-800' 
                : 'bg-emerald-100 text-emerald-800'
            }`}>
              {pendingTasks} pending • {completedTasks} completed
            </span>
          </div>
        </div>

        {totalTasks === 0 ? (
          <div className="text-center py-12 px-4 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50">
            <div className="w-16 h-16 mx-auto bg-gray-200 rounded-full flex items-center justify-center mb-4">
              <Target className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              No tasks assigned to you
            </h3>
            <p className="text-gray-600 mb-4 max-w-md mx-auto">
              When team members assign tasks to you, they will appear here.
            </p>
            <p className="text-sm text-gray-500">
              Check back later or ask your team to assign you tasks
            </p>
          </div>
        ) : (
          <>
            {/* Priority Filter - Optional */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <p className="text-sm text-gray-700">
                  <span className="font-medium">{pendingTasks} task{pendingTasks !== 1 ? 's' : ''}</span> require your attention
                </p>
                <div className="flex items-center gap-2">
                  {/* Add priority filters here if needed */}
                </div>
              </div>
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