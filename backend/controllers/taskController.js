// controllers/taskController.js
const Joi = require("joi");
const Task = require("../models/Task");

// Joi validation schema for task creation and update
const taskSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().optional(),
  dueDate: Joi.date().required(),
  priority: Joi.string().valid("Low", "Medium", "High").required(),
  assignedUser: Joi.string().allow(null, "").optional(), // Allow assignedUser to be null or empty
});

// Create Task
exports.createTask = async (req, res) => {
  const { error } = taskSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const { title, description, dueDate, priority, assignedUser } = req.body;
  try {
    const task = new Task({
      title,
      description,
      dueDate,
      priority,
      createdBy: req.user._id,
      assignedUser: assignedUser || req.user._id,
    });
    const createdTask = await task.save();
    res.status(201).json(createdTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all Tasks with Pagination and Filtering
exports.getTasks = async (req, res) => {
  const { page = 1, limit = 5, status, priority, assignedUser } = req.query;

  try {
    const query = {
      assignedUser: req.user._id,
      ...(status && { status }),
      ...(priority && { priority }),
      ...(assignedUser && { assignedUser }),
    };

    const tasks = await Task.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Task.countDocuments(query);

    res.json({
      tasks,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Task by ID
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task || task.assignedUser.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Task
exports.updateTask = async (req, res) => {
  const { error } = taskSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const { title, description, dueDate, priority, assignedUser } = req.body;
  try {
    const task = await Task.findById(req.params.id);
    if (!task || task.assignedUser.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: "Task not found" });
    }

    task.title = title || task.title;
    task.description = description || task.description;
    task.dueDate = dueDate || task.dueDate;
    task.priority = priority || task.priority;
    task.assignedUser = assignedUser || task.assignedUser;

    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Task
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task || task.assignedUser.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: "Task not found" });
    }

    await task.deleteOne();
    res.json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark Task as Complete
exports.completeTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task || task.assignedUser.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: "Task not found" });
    }

    task.status = "Completed";
    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Generate Task Summary Report (JSON/CSV)
const { Parser } = require("json2csv");

exports.getTaskSummaryReport = async (req, res) => {
  try {
    const { format = "json", status, priority, user } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (user) filter.assignedUser = user;

    const tasks = await Task.find(filter).populate(
      "assignedUser",
      "name email"
    );

    if (format === "csv") {
      const fields = [
        "title",
        "description",
        "dueDate",
        "status",
        "priority",
        "assignedUser.name",
      ];
      const json2csvParser = new Parser({ fields });
      const csv = json2csvParser.parse(tasks);
      res.header("Content-Type", "text/csv");
      res.attachment("task_summary_report.csv");
      return res.send(csv);
    }

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
