// import "dotenv/config";
import express from "express";
import cors from "cors"; 
import dataRoutes from "./routes/data.js";
import userRoutes from "./routes/users.js";
import apiRoutes from "./routes/api.js";

import recRoutes from "./recommendations/routes.js";
import cdsRoutes from "./cds/routes.js";


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
app.use("/api", apiRoutes);

// User routes
app.use("/api", userRoutes);

app.use("/", recRoutes);

app.use("/cds", cdsRoutes);



// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});



