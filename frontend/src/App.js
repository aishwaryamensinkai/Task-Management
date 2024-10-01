// src/App.js
import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { isAuthenticated } from "./services/authService";
import Register from "./components/Auth/Register";
import Login from "./components/Auth/Login";
import Dashboard from "./pages/Dashboard";
import Header from "./components/Header";
import TaskDetails from "./components/Tasks/TaskDetails";

const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/tasks/:id" // Add the route for task details
          element={
            <PrivateRoute>
              <TaskDetails />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
