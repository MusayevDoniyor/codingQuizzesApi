const express = require("express");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const router = require("./routes");
const corsOptions = require("./config/corsOptions");

const app = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(helmet());
app.use(mongoSanitize());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use("/uploads", express.static("uploads"));
app.use("/", router);
module.exports = app;
