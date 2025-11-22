const NodeGeocoder = require("node-geocoder");

const options = {
  provider: process.env.GEOCODER_PROVIDER,
  httpAdapter: "https",
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null,
};

console.log(`Geocoder initialized with provider: ${options.provider}`);

const geocoder = NodeGeocoder(options);

module.exports = geocoder;
