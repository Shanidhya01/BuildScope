const express = require("express");
const {
  createProject,
  getProjects,
  getProjectById,
  deleteProject,
  updateProject
} = require("../controllers/project.controller");

const router = express.Router();

router.post("/", createProject);
router.get("/", getProjects);
router.get("/:id", getProjectById);
router.delete("/:id", deleteProject);
router.put("/:id", updateProject);


module.exports = router;
