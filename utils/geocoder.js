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
const MAX_RETRY_DELAY_MS = 5000;

// Failures worth retrying: rate limits, timeouts, gateway/server errors and
// transient socket/DNS problems. Anything else is permanent.
const TRANSIENT_STATUS = new Set([408, 425, 429, 500, 502, 503, 504]);
const TRANSIENT_CODES = new Set([
  "ECONNRESET",
  "ECONNREFUSED",
  "ECONNABORTED",
  "ETIMEDOUT",
  "EPIPE",
  "EAI_AGAIN",
  "ENETUNREACH",
]);

let queue = Promise.resolve();
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const retryDelay = (attempt) =>
  Math.min(REQUEST_GAP_MS * attempt, MAX_RETRY_DELAY_MS);

const isTransient = (error) => {
  if (!error) return false;

  const status =
    error.status ??
    error.statusCode ??
    (error.response && error.response.status);
  if (typeof status === "number") return TRANSIENT_STATUS.has(status);

  return typeof error.code === "string" && TRANSIENT_CODES.has(error.code);
};

const geocode = (address) => {
  const task = queue.then(async () => {
    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      let results;

      try {
        results = await geocoder.geocode(address);
      } catch (error) {
        // Permanent errors (and exhausted transient retries) are surfaced as
        // distinct failures instead of being turned into an empty result.
        if (!isTransient(error) || attempt >= MAX_ATTEMPTS) {
          throw error;
        }

        console.warn(
          `Geocode attempt ${attempt}/${MAX_ATTEMPTS} failed (${
            error.code || error.status || error.message
          }) for "${address}" -> retrying`.yellow,
        );
        await sleep(retryDelay(attempt));
        continue;
      }

      if (results && results.length) {
        // Hold the gap before releasing the queue so the next queued request
        // cannot start sooner than REQUEST_GAP_MS after this one.
        await sleep(REQUEST_GAP_MS);
        return results;
      }

      if (attempt < MAX_ATTEMPTS) {
        console.warn(
          `Geocode attempt ${attempt}/${MAX_ATTEMPTS} returned no result for "${address}"`
            .yellow,
        );
        await sleep(retryDelay(attempt));
      }
    }

    return [];
  });

  queue = task.catch(() => {});
  return task;
};

module.exports = { geocode };
