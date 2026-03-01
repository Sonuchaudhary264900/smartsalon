const authMiddleware = require("../middleware/authMiddleware");
const express = require("express");
const router = express.Router();
const Salon = require("../models/Salon");

// CREATE SALON
router.post("/create", async (req, res) => {
    try {
        console.log(req.body);  // ADD THIS

        const { ownerId, salonName, location, photo } = req.body;

        const newSalon = new Salon({
            ownerId,
            salonName,
            location,
            photo
        });

        await newSalon.save();
        res.status(201).json({ message: "Salon created successfully" });

    } catch (error) {
        console.log(error); // ADD THIS
        res.status(500).json({ error: error.message });
    }
});
// GET ALL APPROVED SALONS
router.patch(
  "/approve/:id",
  authMiddleware(["admin"]),
  async (req, res) => {
    const updatedSalon = await Salon.findByIdAndUpdate(
      req.params.id,
      { approved: true },
      { new: true }
    );

    res.json({ message: "Salon approved", updatedSalon });
  }
);

module.exports = router;