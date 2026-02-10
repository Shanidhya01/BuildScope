const express = require("express");

const app = express();
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({
    service: "gateway",
    status: "OK"
  });
  res.send("Gateway is Working");
  res.status(200);

});

module.exports = app;
