const colors = require("colors");
const dotenv = require("dotenv");
const path = require("path");

// Load env vars BEFORE requiring geocoder
dotenv.config({ path: path.join(__dirname, "../.env") });

const geocoder = require("../utils/geocoder");

// const address = "New York, NY";
const address = "Dhaka, Bangladesh";

console.log(`Testing geocoder with provider: ${process.env.GEOCODER_PROVIDER}`);
const apiKey = process.env.GEOCODER_API_KEY;
console.log(`API Key is ${apiKey ? "configured" : "not configured"}`);

async function testGeocoder() {
  try {
    const loc = await geocoder.geocode(address);
    console.log("Raw location result:", JSON.stringify(loc, null, 2));
    if (!loc || loc.length === 0) {
      console.log("Geocoding returned empty results.".yellow.inverse);
      process.exit(1);
    }
    console.log("Geocoding Success:".green.inverse);
    console.log(loc);
    process.exit(0);
  } catch (err) {
    console.log("Geocoding Failed:".red.inverse);
    console.error("Error details:", JSON.stringify(err, null, 2));
    console.error("Error message:", err.message);
    process.exit(1);
  }
}

testGeocoder();
