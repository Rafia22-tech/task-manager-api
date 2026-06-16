const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const fs = require("fs");

const app = express();
const PORT = 5000;
const JWT_SECRET = "taskmanagersecretkey";

app.use(express.json());

// File read function
function readUsers() {
  return JSON.parse(fs.readFileSync("users.json", "utf-8"));
}

function writeUsers(users) {
  fs.writeFileSync("users.json", JSON.stringify(users, null, 2));
}

function readTasks() {
  return JSON.parse(fs.readFileSync("tasks.json", "utf-8"));
}

function writeTasks(tasks) {
  fs.writeFileSync("tasks.json", JSON.stringify(tasks, null, 2));
}

// Authentication middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({ message: "Access token required" });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Invalid token format" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }

    req.user = user;
    next();
  });
}

// Authorization middleware
function authorizeAdmin(req, res, next) {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Only admin can access this route" });
  }

  next();
}

// Home route
app.get("/", (req, res) => {
  res.send("Task Manager API is running");
});

// SIGNUP
app.post("/signup", async (req, res) => {
  const users = readUsers();

  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: "Name, email, password and role are required" });
  }

  const existingUser = users.find((user) => user.email === email);

  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = {
    id: users.length > 0 ? users[users.length - 1].id + 1 : 1,
    name,
    email,
    password: hashedPassword,
    role
  };

  users.push(newUser);
  writeUsers(users);

  res.status(201).json({
    message: "Signup successful",
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role
    }
  });
});

// LOGIN
app.post("/login", async (req, res) => {
  const users = readUsers();

  const { email, password } = req.body;

  const user = users.find((user) => user.email === email);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);

  if (!isPasswordMatch) {
    return res.status(401).json({ message: "Invalid password" });
  }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.json({
    message: "Login successful",
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});

// ADMIN: create task and assign to user
app.post("/tasks", authenticateToken, authorizeAdmin, (req, res) => {
  const tasks = readTasks();

  const { title, description, assignedTo } = req.body;

  if (!title || !description || !assignedTo) {
    return res.status(400).json({ message: "Title, description and assignedTo are required" });
  }

  const newTask = {
    id: tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 1,
    title,
    description,
    assignedTo,
    status: "pending"
  };

  tasks.push(newTask);
  writeTasks(tasks);

  res.status(201).json({
    message: "Task created successfully",
    task: newTask
  });
});

// ADMIN: see all tasks
// USER: see only own tasks
app.get("/tasks", authenticateToken, (req, res) => {
  const tasks = readTasks();

  if (req.user.role === "admin") {
    return res.json(tasks);
  }

  const userTasks = tasks.filter((task) => task.assignedTo === req.user.id);
  res.json(userTasks);
});

// GET task by ID
app.get("/tasks/:id", authenticateToken, (req, res) => {
  const tasks = readTasks();
  const taskId = parseInt(req.params.id);

  const task = tasks.find((task) => task.id === taskId);

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  if (req.user.role !== "admin" && task.assignedTo !== req.user.id) {
    return res.status(403).json({ message: "You are not allowed to view this task" });
  }

  res.json(task);
});

// ADMIN: update task
app.put("/tasks/:id", authenticateToken, authorizeAdmin, (req, res) => {
  const tasks = readTasks();
  const taskId = parseInt(req.params.id);

  const taskIndex = tasks.findIndex((task) => task.id === taskId);

  if (taskIndex === -1) {
    return res.status(404).json({ message: "Task not found" });
  }

  const { title, description, assignedTo, status } = req.body;

  tasks[taskIndex] = {
    id: taskId,
    title,
    description,
    assignedTo,
    status
  };

  writeTasks(tasks);

  res.json({
    message: "Task updated successfully",
    task: tasks[taskIndex]
  });
});

// ADMIN: delete task
app.delete("/tasks/:id", authenticateToken, authorizeAdmin, (req, res) => {
  const tasks = readTasks();
  const taskId = parseInt(req.params.id);

  const updatedTasks = tasks.filter((task) => task.id !== taskId);

  if (tasks.length === updatedTasks.length) {
    return res.status(404).json({ message: "Task not found" });
  }

  writeTasks(updatedTasks);

  res.json({ message: "Task deleted successfully" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});