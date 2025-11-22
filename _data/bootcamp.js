const { faker } = require("@faker-js/faker");
const Bootcamp = require("../models/BootcampModel");
const mongoose = require("mongoose");
// import { v4 } from "uuid";

const uri = "mongodb://127.0.0.1:27017/bnodeapi";
const seedCount = 10000;
const batchSize = 100;

// Generate 5 fake bootcamps
function generateBootcamps() {
  const lat = Number(faker.location.latitude());
  const lng = Number(faker.location.longitude());
  return {
    name: faker.company.name(),
    slug: faker.lorem.slug(),
    description: faker.lorem.sentence(10),
    website: faker.internet.url(),
    phone: faker.number.int({ min: 1111111111, max: 9999999999 }),
    email: faker.internet.email(),
    address: faker.location.streetAddress(),
    location: {
      type: "Point",
      coordinates: [lng, lat],
      formattedAddress: faker.location.streetAddress(true),
      street: faker.location.street(),
      city: faker.location.city(),
      state: faker.location.state(),
      zipcode: faker.location.zipCode(),
      country: faker.location.country(),
    },
    careers: faker.helpers.arrayElements(
      [
        "Web Development",
        "Mobile Development",
        "UI/UX",
        "Data Science",
        "Business",
        "Other",
      ],
      { min: 1, max: 3 },
    ),
    averageRating: faker.number.float({ min: 1, max: 10 }),
    averageCost: faker.number.int({ min: 500, max: 10000 }),
    photo: faker.image.urlPicsumPhotos(),
    housing: faker.datatype.boolean(),
    jobAssistance: faker.datatype.boolean(),
    jobGuarantee: faker.datatype.boolean(),
    acceptGi: faker.datatype.boolean(),
    // user: v4(),
  };
}

async function bootcampData() {
  try {
    await mongoose.connect(uri);
    console.log("✅ Connected To MongoDB");

    let buffer = [];

    for (let i = 0; i < seedCount; i++) {
      buffer.push(generateBootcamps());

      if (buffer.length === batchSize || i === seedCount - 1) {
        await Bootcamp.insertMany(buffer);
        buffer.length = 0; // reset without creating a new array
        console.log(`Inserted batch ${i + 1}/${seedCount}`);
      }
    }

    console.log("🎉 SUCCESSFULLY INSERTED DATA");
  } catch (err) {
    console.error("❌ ERROR seeding data:", err);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 MongoDB Disconnected");
  }
}

bootcampData().then(() => {
  console.log("SUCCESSFULLY INSERT");
  process.exit(1);
});
