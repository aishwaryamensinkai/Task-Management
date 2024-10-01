// server.js
const express = require("express");
const dotenv = require("dotenv");
dotenv.config(); // Load environment variables
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const cors = require("cors");

connectDB();

const app = express();
const { errorHandler } = require("./middleware/errorMiddleware");
app.use(errorHandler);

app.use(express.json());

// Set up CORS configuration
app.use(cors({ origin: "http://localhost:3000" }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
