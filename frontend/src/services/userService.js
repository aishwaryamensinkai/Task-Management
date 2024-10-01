// src/services/userService.js
import api from "./api";

// Fetch all users
export const getUsers = async () => {
  const response = await api.get("/users");
  return response.data;
};
