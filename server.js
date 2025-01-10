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

app.use("/questions", questionRoutes);
app.use("/submissions", submissionRoutes);

mongoose
  .connect(mongoConnection, {
    connectTimeoutMS: 20000,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error(err));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
