import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { login, registerUser } from "../api/auth.api";

export const useAuth = () => {
  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: () => navigate("/dashboard")
  });

  const registerMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: () => navigate("/dashboard")
  });

  return { loginMutation, registerMutation };
};
