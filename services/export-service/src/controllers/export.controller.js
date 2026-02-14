const axios = require("axios");
const generatePDF = require("../services/pdf.service");
const generateMarkdown = require("../services/markdown.service");

const exportProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const format = req.query.format || "md";
    const userId = req.headers["x-user-id"];

    const response = await axios.get(
      `${process.env.PROJECTS_SERVICE_URL}/projects/${projectId}`,
      {
        headers: {
          Authorization: req.headers.authorization,
          "x-user-id": userId
        }
      }
    );

    const project = response.data;

    if (format === "md") {
      const markdown = generateMarkdown(project);

      res.setHeader("Content-Type", "text/markdown");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=project-${projectId}.md`
      );

      return res.send(markdown);
    }

    if (format === "pdf") {
      return generatePDF(project, res);
    }

    return res.status(400).json({ message: "Invalid format" });

  } catch (err) {
    if (err.response?.status) {
      return res.status(err.response.status).json({
        message: err.response.data?.message || err.message
      });
    }

    return res.status(500).json({ message: err.message });
  }
};

module.exports = { exportProject };
