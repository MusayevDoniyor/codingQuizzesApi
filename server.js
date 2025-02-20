require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// * Routelar
const questionRoutes = require("./routes/question.route");
const submissionRoutes = require("./routes/solve.route");
const authRoutes = require("./routes/auth.route");
const adminRoutes = require("./routes/admin.route");
const userRoutes = require("./routes/user.route");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to the Coding Quizzes API!");
});

app.use("/api/auth", authRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/solve", submissionRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);

const mongoConnection = process.env.MONGO_URI;
mongoose
  .connect(mongoConnection)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
