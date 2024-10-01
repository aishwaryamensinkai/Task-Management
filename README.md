# Task Management Application

## Objective
Build a basic project/task management application using the MERN (MongoDB, Express, React, Node.js) stack. The application should allow users to:
- Register and login.
- Create, update, and delete tasks.
- Assign tasks to team members.
- Track task statuses (e.g., "To Do", "In Progress", "Completed").
- Generate a summary report of tasks for each user.

## Features & Requirements

### 1. User Authentication (Backend)
- Use JWT for authentication.
- Implement registration, login, and logout endpoints.
- Use password hashing for storing user passwords securely.

### 2. Task Management (Backend & Frontend)
- A user can create tasks.
- Each task should have the following fields:
  - **Title**
  - **Description**
  - **Due Date**
  - **Status** (To Do, In Progress, Completed)
  - **Assigned User**
  - **Priority** (Low, Medium, High)
- Users can update or delete tasks.
- Users can view their tasks in a task list (with pagination).
- Implement basic search and filtering options based on status, priority, or assigned users.

### 3. Task Assignment (Backend & Frontend)
- Admin users can assign tasks to other registered users in the system.
- Non-admin users should only be able to see tasks assigned to them or tasks they created themselves.

### 4. Task Summary Report (Backend)
- Implement an API endpoint that generates a summary report of tasks based on different filters (e.g., by status, user, or date).
- The report should be returned as JSON or CSV.

## Technical Guidelines

### Backend
- Use Node.js with Express for the API.
- Use MongoDB (via Mongoose) for data storage.
- Implement proper error handling and input validation using a library like Joi or Validator.js.
- Follow RESTful API design principles.

### Frontend
- Use React.js (with hooks) for the frontend.
- Handle API requests using axios or fetch.
- Use a state management solution like Context API or Redux.
