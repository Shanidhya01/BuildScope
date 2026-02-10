const express = require("express");

const app = express();
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({
    service: "project-service",
    status: "OK"
  });
  res.send("Project Service is Working");
  res.status(200);
});

module.exports = app;
