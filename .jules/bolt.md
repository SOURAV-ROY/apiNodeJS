## 2026-08-14 - Concurrent Database Queries in Paginated Middleware

**Learning:** In `advancedResults` pagination middleware, awaiting `model.countDocuments()` sequentially before awaiting `query` forced two consecutive round-trips to MongoDB. Executing both queries concurrently via `Promise.all([model.countDocuments(parsedQuery), query])` cuts database latency in half for paginated list endpoints. Passing `parsedQuery` to `countDocuments` also ensures accurate pagination metadata for filtered queries.
**Action:** When building pagination or aggregated responses, always combine independent database queries (such as document counts and record fetches) using `Promise.all()` to minimize serial database latency.
