## 2026-08-14 - Mongoose Foreign Key Indexing
**Learning:** Foreign key queries in Mongoose models without explicit `{ index: true }` trigger full collection scans ($O(N)$), degrading performance significantly as data grows (especially for endpoints like GET `/api/v1/bootcamps/:bootcampId/courses` and GET `/api/v1/bootcamps/:bootcampId/reviews`).
**Action:** Always verify that foreign key reference fields (such as `bootcamp` and `user` in child schemas) explicitly define `index: true` in Mongoose schema paths.
