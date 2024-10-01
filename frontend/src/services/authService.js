// src/services/authService.js
import api from "./api";

// Register a new user
export const register = async (userData) => {
  const response = await api.post("/auth/register", userData);
  return response.data;
};

// Log in a user
export const login = async (credentials) => {
  try {
    console.log("auth service " + credentials);
    const response = await api.post("/auth/login", credentials);
    return response.data;
  } catch (error) {
    console.error(
      "Error in login request:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

// Log out the user
export const logout = () => {
  localStorage.removeItem("token");
};

// Check if the user is authenticated
export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};
