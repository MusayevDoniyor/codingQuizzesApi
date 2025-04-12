const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard", "advanced"],
      required: true,
    },
    category: { type: String, required: true, trim: true },
    options: [{ type: String, required: true, minlength: 1 }],
    correctAnswer: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return this.options.includes(v);
        },
        message: "correctAnswer must be one of the options",
      },
    },
    explanation: { type: String, required: true, trim: true },
    points: { type: Number, default: 1, min: 1 },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tags: [{ type: String, required: true, trim: true }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Question", questionSchema);
