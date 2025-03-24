import express from "express";
import cors from "cors";
import uploadRoutes from "./routes/uploadRoutes.js";
import statsRoutes from "./routes/StatsRoutes.js";
import statementRoutes from "./routes/StatementRoutes.js";
import relatedWorksRoutes from "./routes/RelatedWorksRoutes.js";
import guestRoutes from "./routes/GuestRoutes.js";
import userRoutes from "./routes/UserRoutes.js";
import referencesRoutes from "./routes/ReferencesRoutes.js";

import testingRoutes from "./routes/TestingRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

// Basic route (like CiteFairly API)
app.get("/", (req, res) => {
    res.json({
        message: "Welcome to the CiteFairly API!",
        status: "running",
        service_routes: {
            upload: "/upload",
            stats: "/stats",
            cds: "/cds",
            related: "/related",
            guest: "/guest",
            user: "/user",
            references: "/ref",
            test: "/test"
        }
    });
});

// Load API routes
app.use("/upload", uploadRoutes);
app.use("/stats", statsRoutes);
app.use("/cds", statementRoutes);
app.use("/related", relatedWorksRoutes);
app.use("/guest", guestRoutes);
app.use("/user", userRoutes);
app.use("/ref", referencesRoutes);

app.use("/test", testingRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));