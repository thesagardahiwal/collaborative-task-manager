import type { JSX } from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const user = localStorage.getItem("user");
  
  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
}
