const express = require("express");
const session = require("express-session");
const app = express();
require("dotenv").config();

// Database connection (no need to call connect separately)
require("./config/db");
if (process.env.NODE_ENV === "development") {
  require("./database/init");
}
// Rest of your app.js remains the same
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
  })
);

const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes);
const placeRoutes = require("./routes/placeRoutes");
app.use("/api/places", placeRoutes);

// Add error handling middleware last
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Routes
app.get("/", (req, res) => {
  res.send("API is running");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
