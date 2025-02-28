const express = require("express");
const compression = require("compression");
const path = require("path");

const app = express();
const port = 3000;

// Enable gzip compression
app.use(compression());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

// Define a route for the home page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
