const express = require("express");
const authRoutes = require("./routes/auth.routes");

const app = express();
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({
    service: "auth-service",
    status: "OK"
  });
  res.send("Auth Service is Working");
  res.status(200);
});


app.use("/auth", authRoutes)

module.exports = app;
