## 2026-09-18 - Optimized `countDocuments` in `advancedResults` Middleware

**Learning:** `model.countDocuments()` without parameters scans or counts all documents in the collection regardless of active query filters in request params. Passing the parsed query filter to `countDocuments(parsedQuery)` allows MongoDB to execute indexed count queries and returns accurate pagination metadata.

**Action:** Always ensure pagination count queries in query-building middleware receive the filtered query filter object rather than executing un-filtered count queries.
