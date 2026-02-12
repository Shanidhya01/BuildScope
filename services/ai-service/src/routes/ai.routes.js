const express = require("express");
const { generate } = require("../controllers/ai.controller");

const router = express.Router();

router.post("/generate", generate);

module.exports = router;
