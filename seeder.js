const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');

//Load env vars *******************************************************
// dotenv.config({path: "./config/config.env"});
dotenv.config();

//Load models *********************************************************
const Bootcamp = require('./models/BootcampModel');
const Course = require('./models/CourseModel');
const User = require('./models/UserModel');
const Review = require('./models/ReviewModel');


//Connect to DB *******************************************************
const optionDB = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
};
mongoose.connect(process.env.MONGO_URI, optionDB);

//Read JSON files ******************************************************
const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8'));
const courses = JSON.parse(fs.readFileSync(`${__dirname}/_data/courses.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/_data/users.json`, 'utf-8'));
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/_data/reviews.json`, 'utf-8'));


//Import into DB *******************************************************
const importData = async () => {
    try {
        await Bootcamp.create(bootcamps);
        await Course.create(courses);
        await User.create(users);
        await Review.create(reviews);

        console.log("Data Imported.....".green.inverse);
        process.exit();
    } catch (errors) {
        console.log(errors);
    }
}

//Delete Data from DB ****************************************************
const deleteData = async () => {
    try {
        await Bootcamp.deleteMany();
        await Course.deleteMany();
        await User.deleteMany();
        await Review.deleteMany();

        console.log("Data Destroyed.....".red.inverse);
        process.exit();
    } catch (errors) {
        console.log(errors);
    }
}

//node seeder.js *********************************************************
if (process.argv[2] === '-i') {
    importData();
} else if (process.argv[2] === '-d') {
    deleteData();
}
