// import "dotenv/config";
import express from "express";
import cors from "cors"; 
import dataRoutes from "./routes/data.js";
import userRoutes from "./routes/users.js";

const app = express();
const PORT = 5000;


// Middleware to parse JSON
app.use(express.json());

app.use(cors({
  origin: "http://localhost:5173", // Replace with your frontend's URL
}));

// Test Route
app.get("/", (req, res) => {
  res.send("Hello, Node.js Backend!");
});

// Register routes
app.use("/data", dataRoutes);

// User routes
app.use("/api", userRoutes);


// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});



