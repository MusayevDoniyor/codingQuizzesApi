const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const questionRoutes = require("./routes/questionRoutes");
const submissionRoutes = require("./routes/submissionRoutes");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

const mongoConnection = process.env.MONGO_URI;

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Welcome to the Coding Quizzes API!");
});

app.use("/api/questions", questionRoutes);
app.use("/api/submissions", submissionRoutes);

mongoose
  .connect(mongoConnection)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error(err));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
