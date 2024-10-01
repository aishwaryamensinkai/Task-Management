import React, { useEffect, useState } from "react";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  completeTask,
  getTaskSummaryReport,
} from "../../services/taskService";
import { getUsers } from "../../services/userService"; // Add this line
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  Box,
  List,
  ListItem,
  Paper,
  Grid,
} from "@mui/material";

if (typeof window !== "undefined") {
  const observerErrorHandler = (event) => {
    if (event.message.includes("ResizeObserver loop limit exceeded")) {
      event.stopImmediatePropagation();
    }
  };
  window.addEventListener("error", observerErrorHandler);
}

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "Low",
    assignedUser: "",
  });
  const [users, setUsers] = useState([]); // Add state for user list
  const [selectedTask, setSelectedTask] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // Pagination state
  const [filters, setFilters] = useState({ status: "", priority: "" });
  const navigate = useNavigate();
  const [reportFormat, setReportFormat] = useState("json");

  // Function to handle task click
  const handleTaskClick = (taskId) => {
    navigate(`/tasks/${taskId}`); // Navigate to the task details page
  };

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await getTasks({ ...filters, page: currentPage });
        setTasks(data.tasks);
      } catch (error) {
        console.error(error);
      }
    };
    fetchTasks();
  }, [filters, currentPage]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsers(); // Fetch users for task assignment
        setUsers(data.users);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUsers();
  }, []);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleTaskSelect = (taskId) => {
    const task = tasks.find((task) => task._id === taskId);
    setSelectedTask(task);
    setFormData({
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      priority: task.priority,
      assignedUser: task.assignedUser || "",
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedTask) {
        await updateTask(selectedTask._id, formData);
        alert("Task updated!");
      } else {
        await createTask(formData);
        alert("Task created!");
      }
      setFormData({
        title: "",
        description: "",
        dueDate: "",
        priority: "Low",
        assignedUser: "",
      });
      setSelectedTask(null);
      const data = await getTasks({ ...filters, page: currentPage });
      setTasks(data.tasks);
    } catch (error) {
      console.error(error);
    }
  };

  const handleTaskDelete = async (taskId) => {
    try {
      await deleteTask(taskId);
      alert("Task deleted!");
      const data = await getTasks({ ...filters, page: currentPage });
      setTasks(data.tasks);
    } catch (error) {
      console.error(error);
    }
  };

  const handleTaskComplete = async (taskId) => {
    try {
      await completeTask(taskId);
      alert("Task marked as completed!");
      const data = await getTasks({ ...filters, page: currentPage });
      setTasks(data.tasks);
    } catch (error) {
      console.error(error);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handlePageChange = (direction) => {
    setCurrentPage((prevPage) => prevPage + direction);
  };

  const handleFetchReport = async () => {
    try {
      const reportData = await getTaskSummaryReport({
        ...filters,
        format: "json",
      });

      // Extract only the required fields
      const filteredData = reportData.map((task) => ({
        title: task.title,
        description: task.description,
        dueDate: task.dueDate,
        status: task.status,
        priority: task.priority,
        assignedUser: task.assignedUser ? task.assignedUser.name : "Unassigned",
      }));

      if (reportFormat === "csv") {
        // Create a downloadable CSV file with filtered data
        const fields = [
          "title",
          "description",
          "dueDate",
          "status",
          "priority",
          "assignedUser",
        ];
        const csvContent = [
          fields.join(","),
          ...filteredData.map((task) =>
            fields.map((field) => task[field]).join(",")
          ),
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "task_summary_report.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        // Create a downloadable JSON file with filtered data
        const blob = new Blob([JSON.stringify(filteredData, null, 2)], {
          type: "application/json",
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "task_summary_report.json");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error("Error fetching task summary report:", error);
    }
  };

  return (
    <Container maxWidth="sm">
      {/* create task */}
      <Box
        mt={4}
        p={3}
        boxShadow={3}
        style={{ borderRadius: "8px", backgroundColor: "#f9f9f9" }}
      >
        <Typography variant="h5" gutterBottom>
          {selectedTask ? "Edit Task" : "Create Task"}
        </Typography>
        <form onSubmit={handleFormSubmit} style={{ padding: "10px" }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Task Title"
                name="title"
                value={formData.title}
                onChange={handleFormChange}
                variant="outlined"
                fullWidth
                size="small" // Make the input smaller
                margin="dense" // Reduce margin
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleFormChange}
                variant="outlined"
                fullWidth
                size="small"
                margin="dense"
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleFormChange}
                fullWidth
                margin="dense"
                required
                size="small"
              />
            </Grid>
            <Grid item xs={6}>
              <Select
                name="priority"
                value={formData.priority}
                onChange={handleFormChange}
                fullWidth
                size="small"
                margin="dense"
              >
                <MenuItem value="Low">Low</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="High">High</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={12}>
              <Select
                name="assignedUser"
                value={formData.assignedUser}
                onChange={handleFormChange}
                fullWidth
                size="small"
                margin="dense"
              >
                <MenuItem value="">Assign to Self</MenuItem>
                {users.map((user) => (
                  <MenuItem key={user._id} value={user._id}>
                    {user.name}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={6}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                {selectedTask ? "Update Task" : "Create Task"}
              </Button>
            </Grid>
            {selectedTask && (
              <Grid item xs={6}>
                <Button
                  variant="outlined"
                  color="secondary"
                  fullWidth
                  onClick={() => handleTaskDelete(selectedTask._id)}
                >
                  Delete Task
                </Button>
              </Grid>
            )}
          </Grid>
        </form>
      </Box>

      {/* Filter and Task List */}
      <Box
        mt={4}
        p={2}
        boxShadow={3}
        style={{ borderRadius: "8px", backgroundColor: "#f9f9f9" }}
      >
        <Typography variant="h6">Filter Tasks</Typography>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              fullWidth
              size="small"
              margin="dense"
            >
              <MenuItem value="">All Status</MenuItem>
              <MenuItem value="To Do">To Do</MenuItem>
              <MenuItem value="In Progress">In Progress</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={6}>
            <Select
              name="priority"
              value={filters.priority}
              onChange={handleFilterChange}
              fullWidth
              size="small"
              margin="dense"
            >
              <MenuItem value="">All Priorities</MenuItem>
              <MenuItem value="Low">Low</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="High">High</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={12}>
            <Select
              name="reportFormat"
              value={reportFormat}
              onChange={(e) => setReportFormat(e.target.value)}
              fullWidth
              size="small"
              margin="dense"
            >
              <MenuItem value="json">JSON</MenuItem>
              <MenuItem value="csv">CSV</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleFetchReport}
              style={{ marginTop: "10px" }}
            >
              Generate Task Summary Report
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* list of tasks */}
      <Box mt={4}>
        <Typography variant="h6">Task List</Typography>
        <List>
          {tasks.map((task) => (
            <ListItem
              key={task._id}
              onClick={() => handleTaskClick(task._id)}
              style={{ cursor: "pointer" }}
            >
              <Paper
                style={{
                  padding: "8px",
                  margin: "5px 0",
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="subtitle1" style={{ flex: 1 }}>
                  {task.title}
                </Typography>
                <Box>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent navigation when clicking edit
                      handleTaskSelect(task._id);
                    }}
                    style={{ marginRight: "5px" }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent navigation when clicking delete
                      handleTaskDelete(task._id);
                    }}
                  >
                    Delete
                  </Button>
                </Box>
              </Paper>
            </ListItem>
          ))}
        </List>

        {/* Pagination Controls */}
        <Box display="flex" justifyContent="center" mt={2}>
          <Button
            variant="text"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(-1)}
            size="small"
          >
            Previous
          </Button>
          <Button
            variant="text"
            onClick={() => handlePageChange(1)}
            size="small"
          >
            Next
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default TaskManager;
