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

## 2026-09-18 - Unhandled Geocoder Null Result DoS

**Vulnerability:** In `controllers/bootcampsController.js`, `getBootcampsInRadius` called `geocoder.geocode(zipcode)` without checking whether a valid location result array was returned. Supplying an unresolvable or invalid zipcode caused `geocoder.geocode` to return an empty array `[]` or `null`, resulting in an unhandled `TypeError` when reading `loc[0].latitude` and leading to potential Denial of Service (DoS).
**Learning:** External service calls (geocoding, external APIs) can return empty results or null objects for unexpected user input. Controllers must validate array presence and length before dereferencing array elements.
**Prevention:** Always check `if (!loc || !loc.length)` after geocoding calls and return a 404 `ErrorResponse` if no result is found.
