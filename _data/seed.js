const { faker } = require("@faker-js/faker");
// const CountryIndexingModel = require('../models/CountryIndexingModel');
const ClaimTypeModel = require("../models/ClaimTypeModel");
const mongoose = require("mongoose");
require("colors");

async function seedData() {
  // Connection URL
  const uri = process.env.MONGO_URI;
  const seed_count = 5000;
  mongoose
    .connect(uri, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Connected To MongoDB".cyan.bold);
    })
    .catch((err) => {
      console.log("ERROR".red.bold, err);
    });

  let timeSeriesData = [];
  // create 5000 fake data
  for (let i = 0; i < seed_count; i++) {
    const name = faker.name.firstName();
    const email = faker.internet.email();
    timeSeriesData.push({name, email});
  }

  const seedDB = async () => {
    await CountryIndexingModel.insertMany(timeSeriesData);
  };

  seedDB().then(() => {
    mongoose.connection.close();
  });
}

seedData().then(() => {
  console.log("SUCCESSFULLY INSERT".green.bold);
});
