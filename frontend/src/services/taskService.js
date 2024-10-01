// src/services/taskService.js
import api from "./api";

// Get tasks
export const getTasks = async (filters) => {
  const response = await api.get("/tasks", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    params: filters,
  });
  return response.data;
};

// Create a new task
export const createTask = async (taskData) => {
  const response = await api.post("/tasks", taskData, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return response.data;
};

// Get a single task by ID
export const getTaskById = async (id) => {
  const response = await api.get(`/tasks/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  // console.log(response.data);
  return response.data;
};

// Update a task by ID
export const updateTask = async (id, taskData) => {
  const response = await api.put(`/tasks/${id}`, taskData, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return response.data;
};

// Delete a task by ID
export const deleteTask = async (id) => {
  const response = await api.delete(`/tasks/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return response.data;
};

// Complete a task
export const completeTask = async (id) => {
  const response = await api.put(`/tasks/${id}/complete`);
  return response.data;
};

// summary report
export const getTaskSummaryReport = async (filters) => {
  const response = await api.get("/tasks/summary/report", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    params: filters,
  });
  return response.data;
};
