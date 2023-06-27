const {faker} = require("@faker-js/faker");
// const CountryIndexingModel = require('../models/CountryIndexingModel');
const UserModel = require("../models/UserModel");
const mongoose = require("mongoose");
require("colors");

async function seedData() {
    // Connection URL
    const uri = "String";
    const seedCount = 5000;
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
    for (let i = 0; i < seedCount; i++) {
        const name = faker.person.firstName();
        const email = faker.internet.email();
        timeSeriesData.push({name, email});
    }

    console.log(timeSeriesData);
    const seedDB = async () => {
        await UserModel.insertMany(timeSeriesData);
    };

    seedDB().then(() => {
        mongoose.connection.close();
    });
}

seedData().then(() => {
    console.log("SUCCESSFULLY INSERT".green.bold);
});
