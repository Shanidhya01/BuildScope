const express = require("express");
const authRoutes = require("./routes/auth.routes");
const aiRoutes = require("./routes/ai.routes");
const projectRoutes = require("./routes/project.routes");
const exportRoutes = require("./routes/export.routes");

const app = express();
app.use(express.json());


//health check endpoint

app.get("/health", (req, res) => {
  res.json({
    service: "gateway",
    status: "OK"
  });
  res.send("Gateway is Working");
  res.status(200);
});


// Proxy routes
app.use("/auth", authRoutes);
app.use("/ai", aiRoutes);
app.use("/projects", projectRoutes);
app.use("/export", exportRoutes);

module.exports = app;
