// routes/taskRoutes.js
const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  completeTask,
  getTaskSummaryReport,
} = require("../controllers/taskController");

router.route("/").post(protect, createTask).get(protect, getTasks);

router
  .route("/:id")
  .get(protect, getTaskById)
  .put(protect, updateTask)
  .delete(protect, deleteTask);

router.put("/:id/complete", protect, completeTask);

router.get("/summary/report", protect, getTaskSummaryReport);

module.exports = router;
