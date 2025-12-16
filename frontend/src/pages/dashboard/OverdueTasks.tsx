import { useOverdueTasks } from "../../hooks/useDashboardTasks";
import TaskCard from "../../components/TaskCard";
import { Loader2, AlertTriangle, Clock, TrendingUp, CheckCircle } from "lucide-react";
import { useState } from "react";

export default function OverdueTasks() {
  const { data, isLoading } = useOverdueTasks();
  const [showAll, setShowAll] = useState(false);

  if (isLoading)
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center p-10">
        <Loader2 className="animate-spin w-12 h-12 text-red-600 mb-4" />
        <p className="text-gray-600">Loading overdue tasks...</p>
      </div>
    );

  const totalTasks = data.length;
  const highPriorityTasks = data.filter((t: any) => t.priority === 'high').length;
  const displayTasks = showAll ? data : data.slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-red-100 text-red-600">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Overdue Tasks</h1>
          </div>
          <p className="text-gray-600">
            Tasks that have passed their due date
          </p>
        </div>
        
        <div className={`inline-flex items-center gap-2 px-4 py-3 rounded-lg font-medium ${
          totalTasks > 0 
            ? 'bg-red-100 text-red-700 border border-red-200' 
            : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
        }`}>
          <AlertTriangle className="w-5 h-5" />
          <span>
            {totalTasks > 0 
              ? `${totalTasks} overdue task${totalTasks !== 1 ? 's' : ''}`
              : 'No overdue tasks!'
            }
          </span>
        </div>
      </div>

      {/* Warning Banner */}
      {totalTasks > 0 && (
        <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full bg-red-100">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-red-800 mb-1">
                  Attention Required
                </h3>
                <p className="text-red-700">
                  {totalTasks === 1 
                    ? "1 task has passed its deadline. Please review and update its status."
                    : `${totalTasks} tasks have passed their deadlines. Immediate attention is recommended.`
                  }
                </p>
                <p className="text-sm text-red-600 mt-2">
                  <Clock className="w-4 h-4 inline-block mr-1" />
                  These tasks are past due and may require rescheduling or priority adjustment.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Total Overdue */}
        <div className={`rounded-xl p-6 shadow-sm ${
          totalTasks > 0 
            ? 'bg-white border border-red-100' 
            : 'bg-white border border-emerald-100'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Overdue</p>
              <p className={`text-3xl font-bold ${
                totalTasks > 0 ? 'text-red-700' : 'text-emerald-700'
              }`}>
                {totalTasks}
              </p>
            </div>
            <div className={`p-3 rounded-full ${
              totalTasks > 0 ? 'bg-red-50' : 'bg-emerald-50'
            }`}>
              <Clock className={`w-6 h-6 ${
                totalTasks > 0 ? 'text-red-600' : 'text-emerald-600'
              }`} />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className={`text-sm ${
              totalTasks > 0 ? 'text-red-700' : 'text-emerald-700'
            }`}>
              {totalTasks > 0 
                ? "Past due tasks require immediate action"
                : "All tasks are on schedule!"
              }
            </p>
          </div>
        </div>

        {/* High Priority */}
        {totalTasks > 0 && (
          <div className="bg-white border border-orange-100 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600 mb-1">High Priority</p>
                <p className="text-3xl font-bold text-orange-700">{highPriorityTasks}</p>
              </div>
              <div className="p-3 rounded-full bg-orange-50">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-orange-50">
              <p className="text-sm text-orange-700">
                {highPriorityTasks > 0 
                  ? "Urgent attention needed"
                  : "No high priority overdue tasks"
                }
              </p>
            </div>
          </div>
        )}

        {/* Status Summary */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Status</p>
              <p className="text-lg font-bold text-gray-900">
                {totalTasks > 0 ? 'Action Required' : 'All Clear'}
              </p>
            </div>
            <div className={`p-3 rounded-full ${
              totalTasks > 0 ? 'bg-red-50' : 'bg-emerald-50'
            }`}>
              {totalTasks > 0 ? (
                <AlertTriangle className="w-6 h-6 text-red-600" />
              ) : (
                <CheckCircle className="w-6 h-6 text-emerald-600" />
              )}
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-600">
              {totalTasks > 0 
                ? "Review and update overdue tasks"
                : "Great job keeping tasks on schedule!"
              }
            </p>
          </div>
        </div>
      </div>

      {/* Task List Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Overdue Task Details
          </h2>
          {totalTasks > 4 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              {showAll ? 'Show Less' : `Show All (${totalTasks})`}
            </button>
          )}
        </div>

        {totalTasks === 0 ? (
          <div className="text-center py-12 px-4 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50">
            <div className="w-16 h-16 mx-auto bg-emerald-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              No overdue tasks!
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Excellent! All tasks are on schedule and meeting their deadlines.
            </p>
            <div className="mt-6 p-4 bg-white rounded-lg border border-emerald-100 inline-block">
              <p className="text-sm text-emerald-700">
                🎉 Keep up the great work!
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Action Suggestions */}
            <div className="bg-red-50 border border-red-100 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-red-800 mb-1">Recommended Actions:</p>
                  <ul className="text-sm text-red-700 list-disc pl-5 space-y-1">
                    <li>Review each overdue task and update its status</li>
                    <li>Consider extending deadlines if needed</li>
                    <li>Communicate with task creators about delays</li>
                    <li>Prioritize high-priority tasks first</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Task Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {displayTasks.map((t: any) => (
                <TaskCard key={t._id} task={t} />
              ))}
            </div>

            {/* Show More/Less */}
            {totalTasks > 4 && (
              <div className="text-center pt-4">
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors duration-200"
                >
                  {showAll ? 'Show Less' : `Load ${totalTasks - 4} More Task${totalTasks - 4 !== 1 ? 's' : ''}`}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}