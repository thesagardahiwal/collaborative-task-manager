import { useTasks } from "../hooks/useTasks";
import TaskCard from "../components/TaskCard";
import { useUsers } from "../hooks/useUsers";
import { useState, useEffect } from "react";
import { Plus, Filter, Search, Calendar, Loader2, AlertCircle } from "lucide-react";
import { toast } from "react-toastify";

export default function Tasks() {
  const { tasksQuery, createTaskMutation } = useTasks();
  const { data: users, isLoading: usersLoading } = useUsers();

  const [form, setForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "Low",
    assignedToId: "" 
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [filteredTasks, setFilteredTasks] = useState([]);

  // Validation rules
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Title validation
    if (!form.title.trim()) {
      newErrors.title = "Title is required";
    } else if (form.title.trim().length < 3) {
      newErrors.title = "Title must be at least 3 characters";
    } else if (form.title.trim().length > 100) {
      newErrors.title = "Title must be less than 100 characters";
    }

    // Description validation (optional but with limits if provided)
    if (form.description && form.description.length > 1000) {
      newErrors.description = "Description must be less than 1000 characters";
    }

    // Due date validation
    if (form.dueDate) {
      const selectedDate = new Date(form.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.dueDate = "Due date cannot be in the past";
      }
    }

    // Priority validation (should always be valid from dropdown)
    const validPriorities = ["Low", "Medium", "High", "Urgent"];
    if (!validPriorities.includes(form.priority)) {
      newErrors.priority = "Invalid priority selected";
    }

    return newErrors;
  };

  // Validate field on change
  const validateField = (name: string, value: string) => {
    switch (name) {
      case "title":
        if (!value.trim()) return "Title is required";
        if (value.trim().length < 3) return "Title must be at least 3 characters";
        if (value.trim().length > 100) return "Title must be less than 100 characters";
        break;
      case "description":
        if (value.length > 1000) return "Description must be less than 1000 characters";
        break;
      case "dueDate":
        if (value) {
          const selectedDate = new Date(value);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          if (selectedDate < today) return "Due date cannot be in the past";
        }
        break;
      default:
        return "";
    }
    return "";
  };

  const handleBlur = (field: string) => {
    setTouched({ ...touched, [field]: true });
    const error = validateField(field, form[field as keyof typeof form]);
    if (error) {
      setErrors({ ...errors, [field]: error });
    } else {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }
  };

  const handleChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
    
    // Clear error when user starts typing
    if (errors[field]) {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }
  };

  // Reset form and validation state
  const resetForm = () => {
    setForm({ title: "", description: "", dueDate: "", priority: "Low", assignedToId: "" });
    setErrors({});
    setTouched({});
  };

  useEffect(() => {
    if (tasksQuery.data?.data?.tasks) {
      let tasks = tasksQuery.data.data.tasks;
      
      // Apply search filter
      if (searchQuery) {
        tasks = tasks.filter((task: any) =>
          task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.description?.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      // Apply priority filter
      if (priorityFilter !== "All") {
        tasks = tasks.filter((task: any) => task.priority === priorityFilter);
      }
      
      setFilteredTasks(tasks);
    }
  }, [tasksQuery.data, searchQuery, priorityFilter]);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched
    const allTouched = Object.keys(form).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {} as Record<string, boolean>);
    setTouched(allTouched);
    
    // Validate form
    const formErrors = validateForm();
    setErrors(formErrors);
    
    // If there are errors, don't submit
    if (Object.keys(formErrors).length > 0) {
      // Scroll to first error
      const firstErrorField = Object.keys(formErrors)[0];
      document.getElementById(firstErrorField)?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
      return;
    }
    
    const payload = {
      ...form,
      assignedToId: (form.assignedToId.length > 2 ? form.assignedToId : undefined)
    };

    createTaskMutation.mutate(payload, {
      onError: (res) => {
        toast(res.message);
      }
    });
    resetForm();
    setShowCreateForm(false);
  };

  const handleCloseModal = () => {
    if (Object.values(touched).some(t => t) && 
        (form.title || form.description || form.dueDate)) {
      const confirmClose = window.confirm(
        "You have unsaved changes. Are you sure you want to close?"
      );
      if (!confirmClose) return;
    }
    setShowCreateForm(false);
    resetForm();
  };

  // Check if form is valid
  const isFormValid = () => {
    return Object.keys(validateForm()).length === 0;
  };

  // Stats
  const stats = {
    total: tasksQuery.data?.data?.tasks?.length || 0,
    completed: tasksQuery.data?.data?.tasks?.filter((t: any) => t.status === 'completed').length || 0,
    pending: tasksQuery.data?.data?.tasks?.filter((t: any) => t.status === 'pending').length || 0,
    highPriority: tasksQuery.data?.data?.tasks?.filter((t: any) => t.priority === 'High' || t.priority === 'Urgent').length || 0
  };

  if (tasksQuery.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading your tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen rounded-2xl mx-auto bg-gray-50 p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Tasks</h1>
            <p className="text-gray-600 mt-2">Manage and track your tasks efficiently</p>
          </div>
          
          <button
            onClick={() => setShowCreateForm(true)}
            className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-medium transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <Plus className="w-5 h-5" />
            Create Task
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search tasks by title or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          {/* Filter */}
          <div className="flex items-center gap-3">
            <Filter className="w-5 h-5 text-gray-500" />
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="border border-gray-200 rounded-lg px-4 py-3 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="All">All Priorities</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent</option>
            </select>
          </div>
        </div>
      </div>

      {/* Create Task Modal */}
      {showCreateForm && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity"
            onClick={handleCloseModal}
          />
          <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <form onSubmit={handleCreate} className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Create New Task</h2>
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Title Field */}
                  <div id="title">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Task Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={form.title}
                      onChange={(e) => handleChange("title", e.target.value)}
                      onBlur={() => handleBlur("title")}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                        errors.title && touched.title
                          ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                          : 'border-gray-300'
                      }`}
                      placeholder="Enter task title"
                    />
                    {errors.title && touched.title && (
                      <div className="flex items-center gap-1 mt-2 text-red-600 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        <span>{errors.title}</span>
                      </div>
                    )}
                  </div>

                  {/* Description Field */}
                  <div id="description">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={form.description}
                      onChange={(e) => handleChange("description", e.target.value)}
                      onBlur={() => handleBlur("description")}
                      rows={3}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none ${
                        errors.description && touched.description
                          ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                          : 'border-gray-300'
                      }`}
                      placeholder="Add a detailed description..."
                    />
                    <div className="flex justify-between mt-1">
                      {errors.description && touched.description ? (
                        <div className="flex items-center gap-1 text-red-600 text-sm">
                          <AlertCircle className="w-4 h-4" />
                          <span>{errors.description}</span>
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500">
                          {form.description.length}/1000 characters
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Due Date Field */}
                    <div id="dueDate">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Due Date
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="date"
                          value={form.dueDate}
                          onChange={(e) => handleChange("dueDate", e.target.value)}
                          onBlur={() => handleBlur("dueDate")}
                          min={new Date().toISOString().split('T')[0]}
                          className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                            errors.dueDate && touched.dueDate
                              ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                              : 'border-gray-300'
                          }`}
                        />
                      </div>
                      {errors.dueDate && touched.dueDate && (
                        <div className="flex items-center gap-1 mt-2 text-red-600 text-sm">
                          <AlertCircle className="w-4 h-4" />
                          <span>{errors.dueDate}</span>
                        </div>
                      )}
                    </div>

                    {/* Priority Field */}
                    <div id="priority">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Priority
                      </label>
                      <select
                        value={form.priority}
                        onChange={(e) => handleChange("priority", e.target.value)}
                        onBlur={() => handleBlur("priority")}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                          errors.priority && touched.priority
                            ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                            : 'border-gray-300'
                        }`}
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                        <option value="Urgent">Urgent</option>
                      </select>
                      {errors.priority && touched.priority && (
                        <div className="flex items-center gap-1 mt-2 text-red-600 text-sm">
                          <AlertCircle className="w-4 h-4" />
                          <span>{errors.priority}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Assigned To Field */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assign To
                  </label>

                  {usersLoading ? (
                    <p className="text-gray-500 text-sm">Loading users...</p>
                  ) : (
                    <select
                      value={form.assignedToId}
                      onChange={(e) => handleChange("assignedToId", e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    >
                      <option value="">Unassigned</option>
                      {users?.map((u: any) => (
                        <option key={u._id} value={u._id}>
                          {u.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Validation Summary (if multiple errors) */}
                {Object.keys(errors).length > 0 && (
                  <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="w-5 h-5 text-red-600" />
                      <h3 className="font-medium text-red-800">
                        Please fix the following errors:
                      </h3>
                    </div>
                    <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                      {Object.entries(errors).map(([field, error]) => (
                        <li key={field}>
                          <span className="capitalize">{field}:</span> {error}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex gap-3 mt-8">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createTaskMutation.isPending || !isFormValid()}
                    className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium flex items-center justify-center gap-2"
                  >
                    {createTaskMutation.isPending ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create Task"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}

      {/* Task List */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            All Tasks ({filteredTasks.length})
          </h2>
          <div className="text-sm text-gray-500">
            Showing {filteredTasks.length} of {stats.total} tasks
          </div>
        </div>

        {filteredTasks.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-200">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
            <p className="text-gray-500 mb-6">Create your first task to get started</p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              <Plus className="w-5 h-5" />
              Create Task
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTasks.map((t: any) => (
              <TaskCard key={t._id} task={t} />
            ))}
          </div>
        )}
      </div>

      {/* Quick Stats Footer */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span>Low Priority: {tasksQuery.data?.data?.tasks?.filter((t: any) => t.priority === 'Low').length || 0}</span>
            </span>
            <span className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span>Completed: {stats.completed}</span>
            </span>
          </div>
          <div>
            Last updated: {new Date().toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        </div>
      </div>
    </div>
  );
}