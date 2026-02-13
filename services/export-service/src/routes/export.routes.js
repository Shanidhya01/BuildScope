const express = require("express");
const { exportProject } = require("../controllers/export.controller");

const router = express.Router();

router.get("/:projectId", exportProject);

module.exports = router;
