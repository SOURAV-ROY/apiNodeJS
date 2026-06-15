const express = require("express");
const session = require("express-session");
const lusca = require("lusca");

const app = express();

app.use(
  session({
    secret: "test-secret",
    resave: false,
    saveUninitialized: true,
  }),
);

app.use(lusca.csrf());

app.get("/token", (req, res) => {
  res.json({
    csrfTokenFromLocals: res.locals._csrf,
    csrfTokenFromReq: req.csrfToken ? req.csrfToken() : "undefined",
  });
});

app.listen(3000, () => {
  console.log("Test server running on port 3000");
});
