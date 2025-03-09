import express from "express";
import cors from "cors";
import uploadRoutes from "./routes/uploadRoutes.js";
import statsRoutes from "./routes/StatsRoutes.js";
import statementRoutes from "./routes/StatementRoutes.js";
import relatedWorksRoutes from "./routes/RelatedWorksRoutes.js";
import guestRoutes from "./routes/GuestRoutes.js";
import userRoutes from "./routes/UserRoutes.js";

import testingRoutes from "./routes/TestingRoutes.js";


const app = express();

app.use(cors());
app.use(express.json());

// Load API routes
app.use("/upload", uploadRoutes);
app.use("/stats", statsRoutes);
app.use("/cds", statementRoutes);
app.use("/related", relatedWorksRoutes);
app.use("/guest", guestRoutes);
app.use("/user", userRoutes);

app.use("/testing", testingRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));