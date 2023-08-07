const mongoose = require("mongoose");

mongoose.set("strictQuery", false);
mongoose.set("strictPopulate", false);

const connectDB = async () => {
  const dbURL = process.env.MONGO_URI;
  const connect = await mongoose.connect(dbURL);

  console.log(
    `MongoDB Connected : ${connect.connection.host}`.yellow.underline.bold
  );
};

module.exports = connectDB;
