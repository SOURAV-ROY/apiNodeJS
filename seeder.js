const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
require("colors");

dotenv.config();

const Bootcamp = require("./models/BootcampModel");
const Course = require("./models/CourseModel");
const User = require("./models/UserModel");
const Review = require("./models/ReviewModel");

const useTestDb =
  process.env.NODE_ENV === "test" ||
  process.argv.includes("--test") ||
  process.argv.includes("-t");

const dbURL = useTestDb
  ? process.env.MONGO_URI_TEST || "mongodb://127.0.0.1:27017/bnodeapi_test"
  : process.env.MONGO_URI;

if (!dbURL) {
  console.error(
    "No MongoDB URI found. Set MONGO_URI, or MONGO_URI_TEST when using the test database."
      .red.bold,
  );
  process.exit(1);
}

if (useTestDb) {
  const geocoder = require("./utils/geocoder");
  geocoder.geocode = async (address) => [
    {
      longitude: -71.104721,
      latitude: 42.350527,
      formattedAddress: address,
      streetName: "Bay State Rd",
      city: "Boston",
      stateCode: "MA",
      zipcode: "02215",
      countryCode: "US",
    },
  ];
}

const bootcamps = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/bootcamps.json`, "utf-8"),
);
const courses = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/courses.json`, "utf-8"),
);
const users = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/users.json`, "utf-8"),
);
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/reviews.json`, "utf-8"),
);

const importData = async () => {
  // Batches are dependent (bootcamps need users, courses need bootcamps, ...),
  // so they are created one at a time and a failure stops the dependents.
  const batches = [
    ["users", () => User.create(users, { aggregateErrors: true })],
    ["bootcamps", () => Bootcamp.create(bootcamps, { aggregateErrors: true })],
    ["courses", () => Course.create(courses, { aggregateErrors: true })],
    ["reviews", () => Review.create(reviews, { aggregateErrors: true })],
  ];

  // { aggregateErrors: true } makes Mongoose return the errors inside the result
  // array instead of throwing, so inspect the batches or failures go unnoticed.
  const failures = [];

  for (const [label, createBatch] of batches) {
    const result = await createBatch();
    const batchFailures = [...result].filter((entry) => entry instanceof Error);

    if (batchFailures.length) {
      failures.push(...batchFailures.map((error) => ({ label, error })));
      // A failed prerequisite would only cascade into more failures downstream.
      break;
    }
  }

  if (failures.length) {
    for (const { label, error } of failures) {
      console.error(`Seed failed [${label}]:`.red.bold, error.message);
    }
    process.exitCode = 1;
    return;
  }

  console.log("Data Imported.....".green.bold);
};

const deleteData = async () => {
  // Bolt Optimization: Execute collection deletions concurrently via Promise.all
  // to eliminate serial database round-trip latency during teardown/reset.
  await Promise.all([
    Review.deleteMany(),
    Course.deleteMany(),
    Bootcamp.deleteMany(),
    User.deleteMany(),
  ]);
  console.log("Data Destroyed.....".red.bold);
};

const run = async () => {
  await mongoose.connect(dbURL);
  console.log(
    `Connected MongoDB In Seeder (${useTestDb ? "test" : "default"}): ${mongoose.connection.name}`
      .green.inverse,
  );

  const action = process.argv[2];
  try {
    if (action === "-i") {
      await importData();
    } else if (action === "-d") {
      await deleteData();
    } else {
      console.log("Usage: node seeder.js -i|-d [--test]".yellow);
      process.exitCode = 1;
      return;
    }
  } catch (errors) {
    console.error(errors);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

run();
