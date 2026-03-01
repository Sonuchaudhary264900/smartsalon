// =======================================================
// ADMIN ANALYTICS ROUTES
// =======================================================

const express = require("express");
const router = express.Router(); // 🔥 THIS LINE WAS MISSING

const User = require("../models/User");
const Salon = require("../models/Salon");
const Booking = require("../models/Booking");


// =======================================================
// GET PLATFORM ANALYTICS
// =======================================================

router.get("/analytics", async (req, res) => {
  try {

    // Total counts
    const totalUsers = await User.countDocuments();
    const totalSalons = await Salon.countDocuments();
    const totalBookings = await Booking.countDocuments();

    // ============================
    // Revenue Calculation
    // ============================

    const confirmedBookings = await Booking.find({ status: "Confirmed" });

    let totalRevenue = 0;

    for (let booking of confirmedBookings) {
      totalRevenue += booking.price || 0;
    }

    // ============================
    // Booking Status Counts
    // ============================

    const pendingCount = await Booking.countDocuments({ status: "Pending" });
    const confirmedCount = await Booking.countDocuments({ status: "Confirmed" });
    const cancelledCount = await Booking.countDocuments({ status: "Cancelled" });

    // ============================
    // Top Performing Salons
    // ============================

    const topSalons = await Booking.aggregate([
      { $match: { status: "Confirmed" } },
      {
        $group: {
          _id: "$salonId",
          totalBookings: { $sum: 1 }
        }
      },
      { $sort: { totalBookings: -1 } },
      { $limit: 5 }
    ]);

    const populatedTopSalons = await Salon.populate(topSalons, {
      path: "_id",
      select: "salonName"
    });

    res.json({
      totalUsers,
      totalSalons,
      totalBookings,
      totalRevenue,
      statusBreakdown: {
        pending: pendingCount,
        confirmed: confirmedCount,
        cancelled: cancelledCount
      },
      topSalons: populatedTopSalons
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;