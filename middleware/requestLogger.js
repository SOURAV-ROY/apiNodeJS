// Structured request logger — emits JSON similar to error logger
const redact = (obj) => {
  if (!obj || typeof obj !== "object") return obj;

  const SENSITIVE =
    /(password|passwd|pwd|token|access_token|secret|ssn|card|cvc|cvv|authorization)/i;
  const out = Array.isArray(obj) ? [] : {};

  Object.keys(obj).forEach((k) => {
    try {
      const v = obj[k];
      if (SENSITIVE.test(k)) {
        out[k] = "[REDACTED]";
        return;
      }

      if (typeof v === "string") {
        // Truncate very large strings
        out[k] = v.length > 2000 ? v.slice(0, 2000) + "...[TRUNCATED]" : v;
        return;
      }

      // shallow copy for simple nested objects/arrays
      if (typeof v === "object") {
        out[k] = Array.isArray(v) ? v.slice(0, 20) : "[OBJECT]";
        return;
      }

      out[k] = v;
    } catch (e) {
      out[k] = "[UNSERIALIZABLE]";
    }
  });

  return out;
};

const requestLogger = (req, res, next) => {
  if (process.env.NODE_ENV === "test") return next();

  const start = process.hrtime.bigint();

  const onFinish = () => {
    try {
      const end = process.hrtime.bigint();
      const durationMs = Number(end - start) / 1e6;

      const statusCode = res.statusCode || 0;
      let level = "info";
      if (statusCode >= 500) level = "error";
      else if (statusCode >= 400) level = "warn";

      const contentType = (req.headers["content-type"] || "").toLowerCase();
      const isMultipart =
        contentType.includes("multipart/form-data") ||
        contentType.includes("application/octet-stream");

      const logEntry = {
        timestamp: new Date().toISOString(),
        level,
        message: `${req.method} ${req.originalUrl}`,
        method: req.method,
        path: req.originalUrl,
        statusCode,
        responseTimeMs: Number(durationMs.toFixed(3)),
        ip:
          req.ip ||
          req.headers["x-forwarded-for"] ||
          (req.connection && req.connection.remoteAddress) ||
          null,
        userAgent: req.get && req.get("user-agent"),
        source: req.headers["x-request-id"] || "unknown",
        params: redact(req.params || {}),
        query: redact(req.query || {}),
        body: isMultipart
          ? "[multipart/form-data or binary]"
          : redact(req.body || {}),
      };

      // Don't log auth header or cookies raw
      const headers = { ...req.headers };
      if (headers.authorization) headers.authorization = "[REDACTED]";
      if (headers.cookie) headers.cookie = "[REDACTED]";
      logEntry.headers = headers;

      // Emit as JSON so ingestion systems can parse it
      if (level === "error") console.error(JSON.stringify(logEntry));
      else console.log(JSON.stringify(logEntry));
    } catch (e) {
      // avoid throwing from logger
      console.error(
        JSON.stringify({
          timestamp: new Date().toISOString(),
          level: "error",
          message: "requestLogger failure",
          error: e.message,
        }),
      );
    }
  };

  res.on("finish", onFinish);
  res.on("close", onFinish);

  next();
};

module.exports = requestLogger;
