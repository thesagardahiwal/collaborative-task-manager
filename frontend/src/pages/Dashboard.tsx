import { useTasks } from "../hooks/useTasks";
import TaskCard from "../components/TaskCard";
import { 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  Calendar,
  Filter,
  Search,
  ChevronRight,
  Loader2,
  BarChart3,
  Users,
  Target,
  FolderPlus,
  UserCheck,
  AlertCircle,
  ArrowRight,
  PlusCircle
} from "lucide-react";
import { useState, useMemo } from "react";
import type { ITask, IUser } from "../types/task.type";
import { Link } from "react-router-dom";

interface DashboardStats {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  highPriorityTasks: number;
  upcomingDeadlines: number;
  averageCompletionTime: number;
  createdTasks: number;
  assignedTasks: number;
  overdueTasks: number;
}

interface TaskFilters {
  status: string;
  priority: string;
  search: string;
}

export default function Dashboard() {
  const { tasksQuery } = useTasks();
  const [filters, setFilters] = useState<TaskFilters>({
    status: "all",
    priority: "all",
    search: ""
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const currentUser = useMemo<string>(() => {
    const parsed = localStorage.getItem("user");
    if (!parsed) return "";
    const user : IUser = JSON.parse(parsed);
    return user._id;
  }, [])
  // Calculate dashboard statistics
  const stats = useMemo<DashboardStats>(() => {
    if (!tasksQuery.data?.data?.tasks) {
      return {
        totalTasks: 0,
        completedTasks: 0,
        pendingTasks: 0,
        highPriorityTasks: 0,
        upcomingDeadlines: 0,
        averageCompletionTime: 0,
        createdTasks: 0,
        assignedTasks: 0,
        overdueTasks: 0
      };
    }

    const tasks: ITask[] = tasksQuery.data.data.tasks;
    const now = new Date();
    const sevenDaysFromNow = new Date(now);
    sevenDaysFromNow.setDate(now.getDate() + 7);

    const completedTasks = tasks.filter(task => task.status === "Completed");
    const pendingTasks = tasks.filter(task => task.status !== "Completed");
    const highPriorityTasks = tasks.filter(task => 
      task.priority === "High" || task.priority === "Urgent"
    );
    
    const upcomingDeadlines = tasks.filter(task => {
      if (!task.dueDate || task.status === "Completed") return false;
      const dueDate = new Date(task.dueDate);
      return dueDate >= now && dueDate <= sevenDaysFromNow;
    }).length;

    // Assuming we have userId available in context
    const userId = currentUser;
    const createdTasks = tasks.filter(task => task.creatorId._id === userId).length;
    const assignedTasks = tasks.filter(task => task.assignedToId?._id === userId).length;
    const overdueTasks = tasks.filter(task => {
      if (!task.dueDate || task.status === "Completed") return false;
      return new Date(task.dueDate) < now;
    }).length;

    return {
      totalTasks: tasks.length,
      completedTasks: completedTasks.length,
      pendingTasks: pendingTasks.length,
      highPriorityTasks: highPriorityTasks.length,
      upcomingDeadlines,
      averageCompletionTime: completedTasks.length > 0 ? 
      Math.round(completedTasks.length / tasks.length * 100) : 0,
      createdTasks,
      assignedTasks,
      overdueTasks
    };
  }, [tasksQuery.data]);

  // Filter tasks based on current filters
  const filteredTasks = useMemo(() => {
    if (!tasksQuery.data?.data?.tasks) return [];
    
    return tasksQuery.data.data.tasks.filter((task: ITask) => {
      // Status filter
      if (filters.status !== "all" && task.status !== filters.status) {
        return false;
      }
      
      // Priority filter
      if (filters.priority !== "all" && task.priority !== filters.priority) {
        return false;
      }
      
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        return (
          task.title.toLowerCase().includes(searchLower) ||
          (task.description && task.description.toLowerCase().includes(searchLower))
        );
      }
      
      return true;
    });
  }, [tasksQuery.data, filters]);

  const handleStatusFilter = (status: string) => {
    setFilters(prev => ({ ...prev, status }));
    setIsFilterOpen(false);
  };

  if (tasksQuery.isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading dashboard...</p>
          <p className="text-gray-400 text-sm mt-1">Fetching your tasks</p>
        </div>
      </div>
    );
  }

  if (tasksQuery.isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-2xl shadow-sm max-w-md">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Dashboard</h3>
          <p className="text-gray-600 mb-6">Unable to load your tasks. Please try again.</p>
          <button
            onClick={() => tasksQuery.refetch()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Dashboard Overview</h1>
            <p className="text-gray-600 mt-2">Track and manage all your tasks in one place</p>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500 hidden md:block">
              Last updated: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Total Tasks</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalTasks}</p>
                <div className="flex items-center gap-2 mt-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-xs text-green-600">Active</span>
                </div>
              </div>
              <div className="w-12 h-12 shrink-0 rounded-xl bg-blue-50 flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Completed</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{stats.completedTasks}</p>
                <p className="text-xs text-gray-500 mt-2">
                  {stats.totalTasks > 0 ? `${stats.averageCompletionTime}% completion rate` : 'No tasks'}
                </p>
              </div>
              <div className="w-12 h-12 shrink-0 rounded-xl bg-green-50 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Pending</p>
                <p className="text-3xl font-bold text-amber-600 mt-2">{stats.pendingTasks}</p>
                <p className="text-xs text-gray-500 mt-2">Requires attention</p>
              </div>
              <div className="w-12 h-12 shrink-0 rounded-xl bg-amber-50 flex items-center justify-center">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">High Priority</p>
                <p className="text-3xl font-bold text-red-600 mt-2">{stats.highPriorityTasks}</p>
                <p className="text-xs text-gray-500 mt-2">Requires immediate attention</p>
              </div>
              <div className="w-12 h-12 shrink-0 rounded-xl bg-red-50 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Cards for Created, Assigned, Overdue Tasks */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Created Tasks Card */}
          <Link 
            to="/dashboard/created"
            className="group bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:border-blue-300 hover:scale-[1.02]"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100 group-hover:bg-blue-200 transition-colors">
                  <FolderPlus className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Created by Me</h3>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.createdTasks}</p>
                <p className="text-sm text-gray-600 mt-1">
                  {stats.createdTasks === 1 ? '1 task created' : `${stats.createdTasks} tasks created`}
                </p>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                stats.createdTasks > 0 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-gray-100 text-gray-600'
              }`}>
                View All
              </div>
            </div>
          </Link>

          {/* Assigned Tasks Card */}
          <Link 
            to="/dashboard/assigned"
            className="group bg-gradient-to-r from-indigo-50 to-indigo-100 border border-indigo-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:border-indigo-300 hover:scale-[1.02]"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-indigo-100 group-hover:bg-indigo-200 transition-colors">
                  <UserCheck className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Assigned to Me</h3>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
            </div>
            <div className="flex items-center gap-2 justify-between">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs bg-indigo-100 rounded-lg text-indigo-800 px-2 py-1 text-center">
                    {stats.assignedTasks && stats.assignedTasks - stats.completedTasks} pending
                  </span>
                  <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded-lg text-center">
                    {stats.completedTasks} completed
                  </span>
                </div>
              </div>
            </div>
          </Link>

          {/* Overdue Tasks Card */}
          <Link 
            to="/dashboard/overdue"
            className={`group rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02] ${
              stats.overdueTasks > 0 
                ? 'bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 hover:border-red-300' 
                : 'bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 hover:border-emerald-300'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  stats.overdueTasks > 0 
                    ? 'bg-red-100 group-hover:bg-red-200' 
                    : 'bg-emerald-100 group-hover:bg-emerald-200'
                } transition-colors`}>
                  <AlertCircle className={`w-6 h-6 ${
                    stats.overdueTasks > 0 ? 'text-red-600' : 'text-emerald-600'
                  }`} />
                </div>
                <h3 className={`font-semibold ${
                  stats.overdueTasks > 0 ? 'text-gray-900' : 'text-gray-900'
                }`}>
                  Overdue Tasks
                </h3>
              </div>
              <ArrowRight className={`w-5 h-5 transition-all ${
                stats.overdueTasks > 0 
                  ? 'text-gray-400 group-hover:text-red-600 group-hover:translate-x-1' 
                  : 'text-gray-400 group-hover:text-emerald-600 group-hover:translate-x-1'
              }`} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-2xl font-bold ${
                  stats.overdueTasks > 0 ? 'text-red-700' : 'text-emerald-700'
                }`}>
                  {stats.overdueTasks}
                </p>
                <p className={`text-sm mt-1 ${
                  stats.overdueTasks > 0 ? 'text-red-600' : 'text-emerald-600'
                }`}>
                  {stats.overdueTasks > 0 
                    ? 'Tasks past deadline'
                    : 'All tasks on schedule!'
                  }
                </p>
              </div>
              <div className={`px-3 py-1 rounded-lg text-center text-sm font-medium ${
                stats.overdueTasks > 0 
                  ? 'bg-red-100 text-red-800' 
                  : 'bg-emerald-100 text-emerald-800'
              }`}>
                {stats.overdueTasks > 0 ? 'Review Now' : 'View Details'}
              </div>
            </div>
          </Link>
        </div>

        {/* Additional Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Upcoming Deadlines</h3>
              <Calendar className="w-5 h-5 text-gray-400" />
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.upcomingDeadlines}</p>
                <p className="text-sm text-gray-600">Tasks due in next 7 days</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Team Overview</h3>
              <Users className="w-5 h-5 text-gray-400" />
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center">
                <Users className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {new Set(tasksQuery.data?.data?.tasks?.map((t: ITask) => t.creatorId)).size || 0}
                </p>
                <p className="text-sm text-gray-600">Active team members</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tasks Section */}
      <div className="mb-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          {/* Section Header */}
          <div className="p-5 border-b border-gray-100">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">All Tasks</h2>
                <p className="text-gray-600 text-sm mt-1">
                  Showing {filteredTasks.length} of {stats.totalTasks} tasks
                </p>
              </div>
              
              {/* Filters and Search */}
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search tasks..."
                    value={filters.search}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                      setFilters(prev => ({ ...prev, search: e.target.value }))
                    }
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  />
                </div>
                
                {/* Filter Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <Filter className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-700 text-sm">Filter</span>
                    <ChevronRight className={`w-4 h-4 text-gray-500 transition-transform ${isFilterOpen ? 'rotate-90' : ''}`} />
                  </button>
                  
                  {isFilterOpen && (
                    <>
                      <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setIsFilterOpen(false)}
                      />
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50 py-2">
                        <div className="px-4 py-2">
                          <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Status</h4>
                          {["all", "To Do", "In Progress", "Review", "Completed"].map(status => (
                            <button
                              key={status}
                              onClick={() => handleStatusFilter(status)}
                              className={`w-full text-left px-2 py-1.5 rounded text-sm mb-1 ${filters.status === status ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}
                            >
                              {status === "all" ? "All Statuses" : status}
                            </button>
                          ))}
                        </div>
                        <div className="border-t px-4 py-2">
                          <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Priority</h4>
                          {["all", "Low", "Medium", "High", "Urgent"].map(priority => (
                            <button
                              key={priority}
                              onClick={() => setFilters(prev => ({ ...prev, priority }))}
                              className={`w-full text-left px-2 py-1.5 rounded text-sm mb-1 ${filters.priority === priority ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}
                            >
                              {priority === "all" ? "All Priorities" : priority}
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Tasks Grid */}
          <div className="p-5">
            {filteredTasks.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No tasks found</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  {filters.status !== "all" || filters.priority !== "all" || filters.search
                    ? "No tasks match your current filters. Try adjusting your search criteria."
                    : "You don't have any tasks yet. Create your first task to get started."}
                </p>
                {(filters.status !== "all" || filters.priority !== "all" || filters.search) && (
                  <button
                    onClick={() => setFilters({ status: "all", priority: "all", search: "" })}
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredTasks.map((task: ITask) => (
                  <TaskCard key={task._id} task={task} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer Stats */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <span>To Do: {filteredTasks.filter((t: ITask) => t.status === "To Do").length}</span>
            </span>
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-500" />
              <span>In Progress: {filteredTasks.filter((t: ITask) => t.status === "In Progress").length}</span>
            </span>
            <span className="items-center gap-2 hidden md:flex">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Completed: {filteredTasks.filter((t: ITask) => t.status === "Completed").length}</span>
            </span>
          </div>
          <div className="text-xs text-gray-500">
            Data refreshes automatically • Last sync: {new Date().toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit',
              second: '2-digit'
            })}
          </div>
        </div>
      </div>
    </div>
  );
}