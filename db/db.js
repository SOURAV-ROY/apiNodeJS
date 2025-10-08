const mongoose = require("mongoose");

mongoose.set("strictQuery", false);
mongoose.set("strictPopulate", false);

const connectDB = async () => {
  const dbURL = process.env.MONGO_URI;
  try {
    const connect = await mongoose.connect(dbURL);
    console.log(
      `MongoDB Connected : ${connect.connection.host}/${connect.connection.name}`
        .blue.underline.bold,
    );
  } catch (error) {
    console.error("Connection error:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
