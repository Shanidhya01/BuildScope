const express = require("express");
const aiRoutes = require("./routes/ai.routes");

const app = express();
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({
    service: "ai-service",
    status: "OK"
  });
  res.send("AI Service is Working");
  res.status(200);
});

app.use("/ai", aiRoutes);

module.exports = app;
