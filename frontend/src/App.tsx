import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import DashboardLayout from "./layouts/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import Profile from "./pages/Profile";
import AssignedTasks from "./pages/dashboard/AssignedTasks";
import CreatedTasks from "./pages/dashboard/CreatedTasks";
import OverdueTasks from "./pages/dashboard/OverdueTasks";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected layout */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />



        <Route
          path="/dashboard/assigned"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <AssignedTasks />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/created"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <CreatedTasks />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/overdue"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <OverdueTasks />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/tasks"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Tasks />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Profile />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="*"
          element={
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
              <div className="text-center max-w-md">
                <h1 className="text-6xl font-extrabold text-gray-800">404</h1>
                <h2 className="mt-4 text-2xl font-semibold text-gray-700">
                  Page Not Found
                </h2>
                <p className="mt-2 text-gray-500">
                  Sorry, the page you’re looking for doesn’t exist or has been moved.
                </p>

                <Link
                  to="/dashboard"
                  className="inline-block mt-6 px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
                >
                  Go to Dashboard
                </Link>
              </div>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
