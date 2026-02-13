const express = require("express");
const exportRoutes = require("./routes/export.routes");

const app = express();

app.get("/health", (req, res) => {
  res.status(200).json({ service: "export-service", status: "OK" });
});

app.use("/", exportRoutes);

module.exports = app;
