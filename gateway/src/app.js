const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth.routes");
const aiRoutes = require("./routes/ai.routes");
const projectRoutes = require("./routes/project.routes");
const exportRoutes = require("./routes/export.routes");
const verifyAuth = require("./middlewares/auth.middleware");

const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000", "https://build-scope-delta.vercel.app"],
    credentials: true
  })
);

app.get("/", (req, res) => {
  res.json({
    message: "BuildScope Gateway is running",
    status: "OK"
  });
});

//health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    service: "gateway",
    status: "OK"
  });
});



// Proxy routes
app.use("/auth", authRoutes);
app.use("/ai", verifyAuth, aiRoutes);
app.use("/projects", verifyAuth, projectRoutes);
app.use("/export", verifyAuth, exportRoutes);

module.exports = app;
