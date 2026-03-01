const express = require("express");
const router = express.Router();
const Salon = require("../models/Salon");
const authMiddleware = require("../middleware/authMiddleware");

/*
---------------------------------------------------
CREATE SALON (Owner)
POST /api/salons/create
---------------------------------------------------
*/
router.post("/create", authMiddleware(["owner"]), async (req, res) => {
  try {
    const { salonName, location, photo } = req.body;

    const newSalon = new Salon({
      ownerId: req.user.id,
      salonName,
      location,
      photo,
      approved: false,
      active: true
    });

    await newSalon.save();

    res.status(201).json({
      message: "Salon created successfully. Waiting for admin approval.",
      newSalon
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// GET SALON BY OWNER
router.get("/owner/:ownerId", async (req, res) => {
  try {
    const salon = await Salon.findOne({
      ownerId: req.params.ownerId
    });

    if (!salon) {
      return res.status(404).json({ error: "No salon found" });
    }

    res.json(salon);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


/*
---------------------------------------------------
GET ALL APPROVED SALONS (Public)
GET /api/salons
---------------------------------------------------
*/
router.get("/", async (req, res) => {
  try {
    const salons = await Salon.find({
      approved: true,
      active: true
    });

    res.json(salons);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


/*
---------------------------------------------------
GET SALON BY ID
GET /api/salons/:id
---------------------------------------------------
*/
router.get("/:id", async (req, res) => {
  try {
    const salon = await Salon.findById(req.params.id);

    if (!salon) {
      return res.status(404).json({ error: "Salon not found" });
    }

    res.json(salon);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


/*
---------------------------------------------------
ADMIN APPROVE SALON
PATCH /api/salons/approve/:id
---------------------------------------------------
*/
router.patch(
  "/approve/:id",
  authMiddleware(["admin"]),
  async (req, res) => {
    try {
      const updatedSalon = await Salon.findByIdAndUpdate(
        req.params.id,
        { approved: true },
        { new: true }
      );

      if (!updatedSalon) {
        return res.status(404).json({ error: "Salon not found" });
      }

      res.json({
        message: "Salon approved successfully",
        updatedSalon
      });

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);


/*
---------------------------------------------------
DISABLE SALON (Admin)
PATCH /api/salons/disable/:id
---------------------------------------------------
*/
router.patch(
  "/disable/:id",
  authMiddleware(["admin"]),
  async (req, res) => {
    try {
      const updatedSalon = await Salon.findByIdAndUpdate(
        req.params.id,
        { active: false },
        { new: true }
      );

      res.json({
        message: "Salon disabled",
        updatedSalon
      });

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

module.exports = router;