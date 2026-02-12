const { generateBlueprint } = require("../services/aiGenerator.service");

const generate = async (req, res) => {
  const { idea } = req.body;

  if (!idea) {
    return res.status(400).json({ message: "Idea is required" });
  }

  try {
    const blueprint = await generateBlueprint(idea);
    res.json(blueprint);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "AI generation failed" });
  }
};

module.exports = { generate };
