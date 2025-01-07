const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  options: { type: [String], required: true },
  correctAnswer: { type: String, required: true },
  category: { type: String, required: true },
  level: { type: String, required: true },
  tags: { type: [String], required: true },
  points: { type: Number, default: 1 },
});

module.exports = mongoose.model("Question", questionSchema);
