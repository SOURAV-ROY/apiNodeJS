## 2026-10-04 - Indexing Foreign Keys and Projecting Fields on Existence Checks

**Learning:** Unindexed foreign key fields (`user` in `BootcampModel`) cause collection scans when checking if a user has published a bootcamp or filtering bootcamps by owner. Furthermore, fetching full Mongoose documents during existence/authorization checks (`addCourse`, `addReview`, `creteBootcamp`) loads unnecessary fields (`location`, `careers`, etc.) and hydrates Mongoose models.
**Action:** Always set `index: true` on foreign key fields in Mongoose models. Chain `.select("_id")` or `.select("field")` with `.lean()` when performing existence and authorization checks to minimize payload size, memory allocation, and CPU hydration cost.

## 2026-10-03 - Optimizing Existence Queries and Foreign Keys in Mongoose Schemas

**Learning:** When performing existence checks (such as checking if a user has already published a bootcamp in `creteBootcamp`), executing `findOne` without field projection or document hydration bypass transfers unnecessary fields over the wire and wastes CPU cycles on Mongoose document hydration. Chaining `.select("_id").lean()` retrieves only the primary key and skips hydration. Additionally, ensuring foreign key fields (like `user` in `BootcampSchema`) have `index: true` avoids full collection scans during owner lookups.

**Action:** Chain `.select("_id").lean()` on Mongoose existence checks and ensure foreign key fields on models have `index: true` configured.
## 2026-09-22 - Indexing Foreign Keys and Chaining `.lean()` in Controller Queries

**Learning:** Unindexed foreign key fields (`bootcamp` and `user` in `CourseModel`) force full collection scans (COLLSCAN) during relational lookups (e.g., `GET /api/v1/bootcamps/:bootcampId/courses`) and aggregation pipelines (`getAverageCost`). Additionally, omitting `.lean()` in controller-level `find` and `findById` queries creates unnecessary Mongoose document hydration overhead when returning read-only JSON responses.
**Action:** Always define `index: true` on foreign key fields in Mongoose schemas and chain `.lean()` on read-only query results in Express controllers to reduce CPU and memory consumption.

## 2026-09-26 - Bypassing Document Hydration in Authentication Middleware & Read Queries

**Learning:** In Express APIs using Mongoose authentication middleware (`protect`), calling `User.findById(id)` without `.lean()` hydrates a full Mongoose document instance on every authenticated request, incurring CPU and memory overhead for change-tracking and schema getters/setters. Chaining `.lean()` bypasses document hydration. Since plain JS objects returned by `.lean()` lack Mongoose virtual getters (such as `.id`), explicitly assigning `req.user.id = req.user._id.toString()` preserves compatibility with downstream authorization checks without document overhead.

**Action:** Chain `.lean()` on authentication user lookups in `protect` middleware and manually attach `req.user.id = req.user._id.toString()`. Apply `.lean()` across all read-only controller queries to minimize GC pressure and execution time.

## 2026-09-21 - Concurrent Execution & Filter Accuracy in Pagination Middleware

**Learning:** In Mongoose pagination middleware (`advancedResults`), executing database queries (`countDocuments` and `find`) sequentially introduces unnecessary round-trip latency. Furthermore, calling `countDocuments()` without passing `parsedQuery` produces inaccurate total counts when query filters are applied.
**Action:** Use `Promise.all([model.countDocuments(parsedQuery), query])` to execute count and data fetch concurrently while ensuring accurate total count calculation for filtered datasets.

<!--  bolt-optimize-advanced-results-17181035364112865129 -->

## 2026-09-20 - Concurrent Query Execution and Clean Filter Passing in Pagination Middleware

**Learning:** In Mongoose/Express pagination middleware (`advancedResults`), executing `model.countDocuments()` sequentially before or after the main dataset query doubles the database latency for list endpoints. Furthermore, hardcoding field population (e.g. `.populate("courses")`) on all queries creates unnecessary overhead for models that don't possess those relationships. Running `model.countDocuments(parsedQuery)` and `query` concurrently using `Promise.all` cuts network round-trip waiting time in half while ensuring accurate filtered counts.

**Action:** When building pagination or filter middleware in Node/Express with Mongoose, parse query filters once and execute count and data fetch operations concurrently via `Promise.all([model.countDocuments(filter), query])`. Avoid hardcoded populate calls on generic model query builders.

## 2026-08-14 - Concurrent Database Queries in Paginated Middleware

**Learning:** In `advancedResults` pagination middleware, awaiting `model.countDocuments()` sequentially before awaiting `query` forced two consecutive round-trips to MongoDB. Executing both queries concurrently via `Promise.all([model.countDocuments(parsedQuery), query])` cuts database latency in half for paginated list endpoints. Passing `parsedQuery` to `countDocuments` also ensures accurate pagination metadata for filtered queries.
**Action:** When building pagination or aggregated responses, always combine independent database queries (such as document counts and record fetches) using `Promise.all()` to minimize serial database latency.
