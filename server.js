require("dotenv").config();

const adminRoutes = require("./routes/adminRoutes");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

/* ------------------------------
   MIDDLEWARE
------------------------------ */
app.use("/api/admin", adminRoutes);
// Allow frontend requests
app.use(cors({
  origin: "*", // You can restrict later with your Vercel URL
}));

// Parse JSON
app.use(express.json());


/* ------------------------------
   DATABASE CONNECTION
------------------------------ */

mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Database Connected ✅");
  })
  .catch((err) => {
    console.error("Database Error ❌", err);
  });


/* ------------------------------
   ROUTES
------------------------------ */

const authRoutes = require("./routes/authRoutes");
const salonRoutes = require("./routes/salonRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const bookingRoutes = require("./routes/bookingRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/salons", salonRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/bookings", bookingRoutes);


/* ------------------------------
   TEST ROUTE
------------------------------ */

app.get("/", (req, res) => {
  res.send("Smart Salon API is Running 🚀");
});


/* ------------------------------
   SERVER START
------------------------------ */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});