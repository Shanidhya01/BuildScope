const express = require("express");
const projectRoutes = require("./routes/project.routes");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "BuildScope Project Service is running",
    status: "OK"
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({ service: "project-service", status: "OK" });
});

app.use("/projects", projectRoutes);

module.exports = app;
