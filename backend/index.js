require("dotenv").config();
const express = require("express");
const app = express();
const dataRoutes = require("./routes/data");
const userRoutes = require("./routes/users");
const PORT = 5000;

// Middleware to parse JSON
app.use(express.json());

// Test Route
app.get("/", (req, res) => {
  res.send("Hello, Node.js Backend!");
});

// Register routes
app.use("/data", dataRoutes);

// User routes
app.use("/users", userRoutes);


// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});



