import type { JSX } from "react";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user } = useAuthContext()
  if (!user) {
    return <Navigate to="/" replace />;
  };
  
  return children;
}
