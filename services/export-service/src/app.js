const express = require("express");
const exportRoutes = require("./routes/export.routes");

const app = express();

app.get("/", (req, res) => {
  res.json({
    message: "BuildScope Export Service is running",
    status: "OK"
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({ service: "export-service", status: "OK" });
});

app.use("/", exportRoutes);

module.exports = app;
