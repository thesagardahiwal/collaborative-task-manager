import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:8000/api",
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      // Clear local data if needed
      localStorage.removeItem("user");

      // Redirect to login
      window.location.href = "/";
    }

    return Promise.reject(error);
  }
);