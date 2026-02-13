const Project = require("../models/project.model");
const { createProjectSchema } = require("../validators/project.validator");

const getAuthenticatedUserId = (req, res) => {
  const userId = req.user?.uid || req.headers["x-user-id"];

  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return null;
  }

  return userId;
};


// CREATE PROJECT
const createProject = async (req, res) => {
  try {
    const userId = getAuthenticatedUserId(req, res);
    if (!userId) return;

    const { error, value } = createProjectSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        message: error.details[0].message
      });
    }

    const project = await Project.create({
      userId,
      idea: value.idea,
      blueprint: value.blueprint
    });

    res.status(201).json(project);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// GET ALL PROJECTS (WITH PAGINATION)
const getProjects = async (req, res) => {
  try {
    const userId = getAuthenticatedUserId(req, res);
    if (!userId) return;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const total = await Project.countDocuments({
      userId
    });

    const projects = await Project.find({
      userId
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      total,
      page,
      pages: Math.ceil(total / limit),
      data: projects
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// GET SINGLE PROJECT (OWNERSHIP ENFORCED)
const getProjectById = async (req, res) => {
  try {
    const userId = getAuthenticatedUserId(req, res);
    if (!userId) return;

    const project = await Project.findOne({
      _id: req.params.id,
      userId
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json(project);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// DELETE PROJECT (OWNERSHIP ENFORCED)
const deleteProject = async (req, res) => {
  try {
    const userId = getAuthenticatedUserId(req, res);
    if (!userId) return;

    const project = await Project.findOneAndDelete({
      _id: req.params.id,
      userId
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json({ message: "Project deleted successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateProject = async (req, res) => {
  try {
    const userId = getAuthenticatedUserId(req, res);
    if (!userId) return;

    const { idea } = req.body;

    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, userId },
      { idea },
      { new: true }
    );

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



module.exports = {
  createProject,
  getProjects,
  getProjectById,
  deleteProject,
  updateProject
};
