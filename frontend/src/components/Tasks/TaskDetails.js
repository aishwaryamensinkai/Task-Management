import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getTaskById,
  updateTask,
  deleteTask,
} from "../../services/taskService"; // Import updateTask and deleteTask
import {
  Container,
  Typography,
  Box,
  Paper,
  CircularProgress,
  Button,
  TextField,
  Select,
  MenuItem,
} from "@mui/material";

const TaskDetails = () => {
  const { id } = useParams(); // Get task ID from URL parameters
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false); // State for edit mode
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "Low",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        const data = await getTaskById(id);
        setTask(data);
        setFormData({
          title: data.title,
          description: data.description,
          dueDate: data.dueDate,
          priority: data.priority,
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchTaskDetails();
  }, [id]);

  const handleDelete = async () => {
    try {
      await deleteTask(id);
      alert("Task deleted successfully!");
      navigate("/tasks"); // Navigate back to task list
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpdate = async () => {
    try {
      await updateTask(id, formData);
      alert("Task updated successfully!");
      setIsEditing(false);
      const updatedTask = await getTaskById(id);
      setTask(updatedTask);
    } catch (error) {
      console.error(error);
    }
  };

  const handleBackToDashboard = () => {
    navigate("/dashboard"); // Adjust the path to your dashboard or task list route
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!task) {
    return <Typography variant="h6">Task not found</Typography>;
  }

  return (
    <Container maxWidth="md">
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mt={2}
      >
        <Button variant="outlined" onClick={handleBackToDashboard}>
          Back to Dashboard
        </Button>
      </Box>
      <Box
        mt={4}
        p={3}
        boxShadow={3}
        style={{ borderRadius: "8px", backgroundColor: "#f9f9f9" }}
      >
        {isEditing ? (
          <Box component="form">
            <TextField
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              multiline
              rows={4}
            />
            <TextField
              type="date"
              label="Due Date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
            <Select
              label="Priority"
              name="priority"
              value={formData.priority}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            >
              <MenuItem value="Low">Low</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="High">High</MenuItem>
            </Select>
            <Box mt={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleUpdate}
                style={{ marginRight: "8px" }}
              >
                Save
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleEditToggle}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        ) : (
          <>
            <Typography variant="h4" gutterBottom>
              {task.title}
            </Typography>
            <Paper elevation={3} style={{ padding: "16px" }}>
              <Typography variant="body1">
                <strong>Description:</strong> {task.description}
              </Typography>
              <Typography variant="body1">
                <strong>Due Date:</strong>{" "}
                {new Date(task.dueDate).toLocaleDateString()}
              </Typography>
              <Typography variant="body1">
                <strong>Priority:</strong> {task.priority}
              </Typography>
              <Typography variant="body1">
                <strong>Status:</strong> {task.status}
              </Typography>
            </Paper>
            <Box mt={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleEditToggle}
                style={{ marginRight: "8px" }}
              >
                Edit
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleDelete}
              >
                Delete
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Container>
  );
};

export default TaskDetails;
