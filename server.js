const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const questionRoutes = require("./routes/questionRoutes");
const submissionRoutes = require("./routes/submissionRoutes");

require("dotenv");

const app = express();
const PORT = process.env.PORT || 5000;

// const mongoConnection = "mongodb://admin:10152009@localhost:27017/codingQuizzes";
// const mongoConnection = "mongodb://codingQuizzesUser:10152009@localhost:27017/codingQuizzes";
const mongoConnection = process.env.MONGO_URI;

// mongodb://codingQuizzesUser:10152009@localhost:27017/codingQuizzes

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Welcome to the Coding Quizzes API!");
});

app.use("/api/questions", questionRoutes);
app.use("/api/submissions", submissionRoutes);

mongoose
  // .connect('mongodb://localhost:27017/codingQuizzes')
  .connect(mongoConnection)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error(err));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
