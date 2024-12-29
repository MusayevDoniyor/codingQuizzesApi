const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question",
    required: true,
  },
  selectedOption: { type: String, required: true },
  isCorrect: { type: Boolean, required: true },
});

module.exports = mongoose.model("Submission", submissionSchema);
