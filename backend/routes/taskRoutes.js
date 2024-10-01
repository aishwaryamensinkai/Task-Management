// routes/taskRoutes.js
const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/authMiddleware");
const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  completeTask,
  getTaskSummaryReport,
} = require("../controllers/taskController");

// Only allow admins to create tasks (i.e., assign tasks to others)
router.route("/").post(protect, admin, createTask).get(protect, getTasks);

router
  .route("/:id")
  .get(protect, getTaskById)
  .put(protect, admin, updateTask) // Only admins can update tasks
  .delete(protect, admin, deleteTask); // Only admins can delete tasks

router.put("/:id/complete", protect, completeTask);

router.get("/summary/report", protect, getTaskSummaryReport);

module.exports = router;
