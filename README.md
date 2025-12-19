# Collaborative Task Manager

A production-ready full-stack collaborative task management application built with modern JavaScript/TypeScript best practices.
The platform enables teams to create, assign, track, and collaborate on tasks in real time with secure authentication and a clean, responsive UI.

## 🎯 Features
- 🔐 Authentication & Authorization
- User registration and login
- Secure password hashing using bcrypt
- JWT-based authentication stored in HttpOnly cookies
- Protected routes and session handling
- User profile view and update
## 🗂️ Task Management
- Full CRUD operations for tasks
- Task attributes:
  - Title (max 100 chars)
  - Description
  - Due date
  - Priority (Low, Medium, High, Urgent)
  -  Status (To Do, In Progress, Review, Completed)
  - Creator
  - Assignee (supports assign, reassign & unassign)

## ⚡ Real-Time Collaboration (Socket.io)

- Live updates when tasks are:
  - Created
  - Updated
  - Assigned / Unassigned
  - Deleted

- Real-time in-app notifications
- Missed notifications are preserved in state

## 📊 Dashboard & Views
- Dashboard overview with statistics
- Dedicated views:
  - Tasks created by me
  - Tasks assigned to me
  - Overdue tasks
- Filtering by status and priority
- Sorting by due date (ascending / descending)

## 🎨 Frontend UX
- Fully responsive UI using Tailwind CSS
- Clean professional layout (Navbar, Sidebar, Dashboard)
- Skeleton loaders and loading states
- Form validation using React Hook Form + Zod

## 🏗️ Architecture Overview
#### Backend Architecture
- Controller → Service → Repository pattern
- DTO validation using Zod
- Centralized error handling with custom AppError
- Socket.io events emitted from service layer
- Unit tests covering business logic

#### Frontend Architecture
- React with TypeScript
- React Query for server state management & caching
- Context-based auth & socket management
- Protected routes & auth guards

#### 🛠️ Tech Stack
##### Frontend
- React (Vite)
- TypeScript
- Tailwind CSS
- React Router
- @tanstack/react-query
- Socket.io Client

##### Backend
- Node.js
- Express.js
- TypeScript
- MongoDB (MongoDB Atlas)
- Mongoose
- Socket.io
- JWT + bcrypt
- Testing
- Jest (unit tests for backend services)

## Deployment

- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

## 📡 API Endpoints (Key)
#### Auth
- POST /api/v1/auth/register
- POST /api/v1/auth/login
- GET /api/v1/auth/me


#### Users
- GET /api/v1/users
- PATCH /api/v1/users/profile

#### Tasks
- POST /api/v1/tasks
- GET /api/v1/tasks
- PATCH /api/v1/tasks/:id
- DELETE /api/v1/tasks/:id
- GET /api/v1/tasks/assigned
- GET /api/v1/tasks/created
- GET /api/v1/tasks/overdue

## ⚡ Real-Time Events (Socket.io)
#### Event Type	Description
- TASK_CREATED	Task created
- TASK_UPDATED	Task updated
- TASK_ASSIGNED	Task assigned to a user
- TASK_UNASSIGNED	Task unassigned
- TASK_DELETED	Task deleted

Notifications are emitted from the backend and consumed by the frontend via a centralized Socket Context.

## 🧪 Testing

Backend unit tests are written using Jest and focus on critical business logic.

Covered:
- Task creation logic
- Task update logic
- Task deletion logic
- Socket event emission

Run Tests
npm test

## ⚙️ Environment Variables
#### Backend (.env)
- PORT=8000
- MONGO_URI=your_mongodb_atlas_uri
- JWT_SECRET=your_secret
- CLIENT_URL = https://collaborative-task-manager-nine.vercel.app
- NODE_ENV=production

#### Frontend (.env)
- VITE_API_URL = https://collaborative-task-manager-c6ew.onrender.com

## 🚀 Local Setup
Backend
cd backend
npm install
npm run dev

## Frontend
cd frontend
npm install
npm run dev

## 🌍 Live Deployment

Frontend: https://collaborative-task-manager-nine.vercel.app

Backend API: https://collaborative-task-manager-c6ew.onrender.com

## 📌 Design Decisions & Trade-offs
- MongoDB chosen for flexible schema and rapid iteration
- HttpOnly cookies used for secure auth instead of localStorage
- Socket events centralized in service layer for consistency
- Notifications stored client-side for simplicity (no DB persistence)
- No role-based access control (out of scope)

## 🧠 Future Improvements (Optional)

- Persistent notification storage
- Audit logging
- Optimistic UI updates


## 👨‍💻 Author

Sagar Dahiwal
