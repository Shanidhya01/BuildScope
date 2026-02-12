const Project = require("../models/project.model");

const createProject = async (req, res) => {
  try {
    const { idea, blueprint } = req.body;

    const project = await Project.create({
      userId: req.user?.uid || "dev-user",
      idea,
      blueprint
    });

    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getProjects = async (req, res) => {
  const projects = await Project.find({
    userId: req.user?.uid || "dev-user"
  }).sort({ createdAt: -1 });

  res.json(projects);
};

const getProjectById = async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }

  res.json(project);
};

const deleteProject = async (req, res) => {
  await Project.findByIdAndDelete(req.params.id);
  res.json({ message: "Project deleted" });
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  deleteProject
};
