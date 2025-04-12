const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "username is required"],
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: true,
      match: [/\S+@\S+\.\S+/, "Please use a valid email address"],
    },
    password: {
      type: String,
      required: true,
      minLength: 6,
    },
    solved_questions: [
      {
        question_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Question",
        },
        isCorrect: Boolean,
        points: Number,
      },
    ],
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    total_points: {
      type: Number,
      default: 0,
    },
    achievements: [
      {
        type: String,
        date: { type: Date, default: Date.now() },
      },
    ],
    email_verified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Parolni saqlashdan oldin hash qilish
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Parolni tekshirish
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
