## 2026-09-20 - Concurrent Query Execution and Clean Filter Passing in Pagination Middleware

**Learning:** In Mongoose/Express pagination middleware (`advancedResults`), executing `model.countDocuments()` sequentially before or after the main dataset query doubles the database latency for list endpoints. Furthermore, hardcoding field population (e.g. `.populate("courses")`) on all queries creates unnecessary overhead for models that don't possess those relationships. Running `model.countDocuments(parsedQuery)` and `query` concurrently using `Promise.all` cuts network round-trip waiting time in half while ensuring accurate filtered counts.

**Action:** When building pagination or filter middleware in Node/Express with Mongoose, parse query filters once and execute count and data fetch operations concurrently via `Promise.all([model.countDocuments(filter), query])`. Avoid hardcoded populate calls on generic model query builders.
