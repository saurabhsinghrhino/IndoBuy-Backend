const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    mongoose
      .connect(process.env.MONGODB_URI)
      .then(console.log("Database connected successfully"));
  } catch (error) {
    console.log("Database", error);
    process.exit(1);
  }
};

module.exports = connectDB;
