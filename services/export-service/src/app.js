const express = require("express");

const app = express();
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({
    service: "export-service",
    status: "OK"
  });
  res.send("Export Service is Working");
  res.status(200);
});

module.exports = app;
