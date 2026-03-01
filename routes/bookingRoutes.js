const authMiddleware = require("../middleware/authMiddleware");
const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");

// CREATE BOOKING
router.post(
  "/create",
  authMiddleware(["customer"]),
  async (req, res) => {
  try {
    const { userId, salonId, serviceId, date, timeSlot } = req.body;

    // Check if slot already booked
    const existingBooking = await Booking.findOne({
      salonId,
      date,
      timeSlot,
      status: "booked"
    });

    if (existingBooking) {
      return res.status(400).json({
        error: "This time slot is already booked"
      });
    }

    const newBooking = new Booking({
      userId,
      salonId,
      serviceId,
      date,
      timeSlot
    });

    await newBooking.save();

    res.status(201).json({
      message: "Booking successful",
      newBooking
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

// GET BOOKINGS BY SALON
router.get("/salon/:salonId", async (req, res) => {
  try {
    const bookings = await Booking.find({
      salonId: req.params.salonId
    });

    res.json(bookings);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// CANCEL BOOKING
router.patch("/cancel/:id", async (req, res) => {
  try {
    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: "cancelled" },
      { new: true }
    );

    if (!updatedBooking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    res.json({
      message: "Booking cancelled successfully",
      updatedBooking
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// UPDATE BOOKING STATUS
router.put("/update-status/:bookingId", async (req, res) => {
  try {
    const { status } = req.body;

    const booking = await Booking.findByIdAndUpdate(
      req.params.bookingId,
      { status },
      { new: true }
    );

    res.json({
      message: "Booking status updated",
      booking
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// GET EARNINGS BY SALON
router.get(
  "/earnings/:salonId",
  authMiddleware(["owner"]),
  async (req, res) => {
  try {
    const bookings = await Booking.find({
      salonId: req.params.salonId,
      status: "booked"
    }).populate("serviceId");

    let total = 0;

    bookings.forEach(b => {
      if (b.serviceId && b.serviceId.price) {
        total += b.serviceId.price;
      }
    });

    res.json({
      totalEarnings: total,
      totalBookings: bookings.length
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// =======================================================
// CUSTOMER CANCEL BOOKING
// This allows customer to cancel their own booking
// Only updates status to "Cancelled"
// =======================================================

router.put("/cancel/:bookingId", async (req, res) => {
  try {

    // Find booking by ID and update status
    const booking = await Booking.findByIdAndUpdate(
      req.params.bookingId,
      { status: "Cancelled" },  // Change status
      { new: true }             // Return updated document
    );

    res.json({
      message: "Booking cancelled successfully",
      booking
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;