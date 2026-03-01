const authRoutes = require("./routes/authRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const salonRoutes = require("./routes/salonRoutes");
const serviceRoutes = require("./routes/serviceRoutes");

const app = express();

// MIDDLEWARE
app.use(cors());
app.use(express.json());   // MUST be BEFORE routes
app.use("/api/bookings", bookingRoutes);
app.use("/api/auth", authRoutes);

// ROUTES
app.use("/api/salons", salonRoutes);
app.use("/api/services", serviceRoutes);

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("Server Running");
});

// DB
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("Database Connected ✅"))
  .catch(err => console.log("Database Error ❌", err));

app.listen(5000, () => console.log("Server running on port 5000"));

