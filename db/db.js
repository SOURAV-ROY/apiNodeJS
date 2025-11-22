const mongoose = require("mongoose");

mongoose.set("strictQuery", false);
mongoose.set("strictPopulate", false);

const connectDB = async () => {
  let dbURL = process.env.MONGO_URI;

  if (process.env.NODE_ENV === "test") {
    dbURL =
      process.env.MONGO_URI_TEST || "mongodb://127.0.0.1:27017/bnodeapi_test";
    console.log(`Using Test Database: ${dbURL}`.yellow.bold);
  }
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
