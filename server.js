require("dotenv").config();
const express = require("express");
const cors = require("cors");

// * Routelar
const questionRoutes = require("./routes/question.route");
const submissionRoutes = require("./routes/solve.route");
const authRoutes = require("./routes/auth.route");
const adminRoutes = require("./routes/admin.route");
const userRoutes = require("./routes/user.route");
const connectDB = require("./config/db");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimiter = require("express-rate-limit");

const app = express();

const allowedOrigins = ["http://localhost:3000", "http://192.168.119.208:3000"];

const limiter = rateLimiter.rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, try again later.",
});

app.use(
  cors({
    origin: function (origin, cb) {
      if (!origin || !allowedOrigins.includes(origin)) cb(null, true);
      else cb(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(helmet());
app.use(morgan("dev"));
app.use(limiter);

app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.send("Welcome to the Coding Quizzes API!");
});

app.use("/api/auth", authRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/solve", submissionRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);

connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
