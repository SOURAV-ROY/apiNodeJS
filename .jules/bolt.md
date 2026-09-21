## 2026-09-21 - Concurrent Execution & Filter Accuracy in Pagination Middleware

**Learning:** In Mongoose pagination middleware (`advancedResults`), executing database queries (`countDocuments` and `find`) sequentially introduces unnecessary round-trip latency. Furthermore, calling `countDocuments()` without passing `parsedQuery` produces inaccurate total counts when query filters are applied.
**Action:** Use `Promise.all([model.countDocuments(parsedQuery), query])` to execute count and data fetch concurrently while ensuring accurate total count calculation for filtered datasets.
