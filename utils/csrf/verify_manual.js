const app = require("../../index");
const http = require("http");

const server = http.createServer(app);

server.listen(0, async () => {
  const port = server.address().port;
  console.log(`Server listening on port ${port}`);

  try {
    const response = await fetch(
      `http://localhost:${port}/api/v1/auth/csrf-token`,
    );
    const data = await response.json();

    console.log("Response status:", response.status);
    console.log("Response data:", data);

    if (response.status === 200 && data.success && data.csrfToken) {
      console.log("SUCCESS: CSRF token retrieved successfully");
    } else {
      console.error("FAILURE: Could not retrieve CSRF token");
      process.exit(1);
    }
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  } finally {
    server.close();
    process.exit(0);
  }
});
