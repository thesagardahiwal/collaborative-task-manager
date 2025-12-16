import { api } from "./axiosClient";

export const getUsers = async () => {
  const res = await api.get("/users");
  return res.data.data.users;
};


export const getProfile = async () => {
  const res = await api.get("/users/u");
  return res.data.data.user;
};

export const updateProfile = async (data: any) => {
  const res = await api.put("/users", data);
  return res.data.data.user;
};