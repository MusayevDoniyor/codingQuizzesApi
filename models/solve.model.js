const mongoose = require("mongoose");

const solveSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      required: true,
    },
    selectedOption: { type: String, required: true },
    isCorrect: { type: Boolean, required: true },
    points: { type: Number, required: true },
    time_taken: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Solve", solveSchema);
