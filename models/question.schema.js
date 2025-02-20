const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard", "advanced"],
      required: true,
    },
    category: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctAnswer: {
      type: String,
      required: true,
      valida: {
        validator: function (v) {
          return this.options.includes(v);
        },
        message: "correctAnswer must be one of the options",
      },
    },
    explanation: { type: String, required: true },
    points: { type: Number, default: 1 },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tags: [{ type: String, required: true }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Question", questionSchema);
