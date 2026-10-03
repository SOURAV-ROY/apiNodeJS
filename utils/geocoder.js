require("colors");
const NodeGeocoder = require("node-geocoder");

const options = {
  provider: process.env.GEOCODER_PROVIDER,
  httpAdapter: "https",
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null,
};

console.log(`Geocoder initialized with provider: ${options.provider}`);

const geocoder = NodeGeocoder(options);

// Providers such as LocationIQ rate limit aggressively, which makes a burst of
// geocode calls (e.g. seeding) return zero results. Serialize calls and retry.
const REQUEST_GAP_MS = 600;
const MAX_ATTEMPTS = 3;

let queue = Promise.resolve();
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const geocode = (address) => {
  const task = queue.then(async () => {
    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      const results = await geocoder.geocode(address);

      if (results && results.length) {
        return results;
      }

      if (attempt < MAX_ATTEMPTS) {
        console.warn(
          `Geocode attempt ${attempt}/${MAX_ATTEMPTS} returned no result for "${address}"`
            .yellow,
        );
        await sleep(REQUEST_GAP_MS * attempt);
      }
    }

    return [];
  });

  queue = task.catch(() => {});
  return task;
};

module.exports = { geocode };
