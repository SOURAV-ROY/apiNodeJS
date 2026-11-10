## 2026-09-15 - Missing Model Schema User Reference & Unhandled TypeError DoS

**Vulnerability:** The `user` reference field on the `Bootcamp` Mongoose model was commented out in `models/BootcampModel.js`. Consequently, newly created bootcamps stripped the `user` field, making `bootcamp.user` `undefined`. Subsequent ownership checks in controller methods (`deleteBootcamp` and `bootcampPhotoUpload`) invoked `bootcamp.user.toString()`, throwing unhandled `TypeError` exceptions that crashed request handling (DoS) and bypassed object-level authorization context.
**Learning:** Model schema definitions must strictly retain ownership foreign keys. Furthermore, property accesses on relational fields in controllers must always use optional chaining (`bootcamp.user?.toString()`) to fail securely when ownership context is missing.
**Prevention:** Ensure all resource models define their required `user` relation, and use safe optional chaining (`obj.user?.toString() !== req.user.id`) in ownership authorization checks.

## 2026-08-14 - JWT Session Orphaning & Denial of Service (DoS) Vulnerability

**Vulnerability:** Deleting a user from the database while they still possess a valid, unexpired JWT token caused the `protect` middleware to assign `req.user = null`. Downstream middlewares and routes that relied on role validation (e.g., checking `req.user.role`) would attempt to access properties of a null object, throwing a `TypeError` and causing a Denial of Service (DoS) or unexpected system crashes.
**Learning:** Checking JWT validity (signature and expiration) is insufficient to guarantee that a user is still active and valid. Authenticated routes must always verify that the user fetched from the database is non-null before allowing request execution to proceed.
**Prevention:** Add a database user presence check `if (!req.user)` directly in the core authentication / token-verification middleware (`protect`) before calling `next()`.

## 2026-09-17 - Mass Assignment in Resource Updates

**Vulnerability:** Relational database references (`user` ownership and `bootcamp` association) in models like `Course` and `Review` were vulnerable to mass assignment during update operations (`updateCourse` and `updateReview`). Because request validation schemas permitted unknown properties, attackers sending custom payload properties (e.g., `{ user: "attackerId", bootcamp: "targetBootcampId" }`) could transfer resource ownership or reassign resources across bootcamps.
**Learning:** Request body schemas with `.unknown(true)` pass extra properties directly to controller functions. When calling `findByIdAndUpdate(id, req.body)`, any unstripped relation or identity properties in `req.body` overwrite existing schema attributes.
**Prevention:** In update controller functions, explicitly delete immutable relational fields (`delete req.body.user; delete req.body.bootcamp;`) prior to invoking database update methods like `findByIdAndUpdate`.

## 2026-11-10 - Unhandled TypeError / DoS via Unvalidated Geocoder Results

**Vulnerability:** In `controllers/bootcampsController.js`, `getBootcampsInRadius` blindly accessed `loc[0].latitude` and `loc[0].longitude` on the result returned by `geocoder.geocode(zipcode)` without checking if `loc` was non-empty. When a user supplied an unresolvable or invalid zipcode (or when the geocoder provider experienced rate limits/outages returning empty results `[]`), `loc[0]` was `undefined`, triggering an unhandled `TypeError` that crashed request processing (Denial of Service).
**Learning:** Third-party geocoding and external resolution lookups can fail, yield zero matches, or return empty arrays for invalid user input. Accessing index `[0]` without checking array presence and length exposes the application to unhandled runtime exceptions.
**Prevention:** Always validate external service array results (`if (!loc || !loc.length)`) and fail securely by returning a client-friendly 404 `ErrorResponse` before attempting property dereferencing.
