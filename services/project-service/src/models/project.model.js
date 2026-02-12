const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true
    },
    idea: {
      type: String,
      required: true
    },
    blueprint: {
      type: Object,
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);
