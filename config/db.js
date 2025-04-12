const { default: mongoose } = require("mongoose");

const connectDB = async () => {
  const mongoConnection = process.env.MONGO_URI;

  await mongoose
    .connect(mongoConnection)
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch((err) => {
      console.error("❌ MongoDB connection error:", err.message);
      process.exit(1);
    });
};

module.exports = connectDB;
