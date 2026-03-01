const express = require("express");
const router = express.Router();
const Service = require("../models/Service");

// ADD SERVICE TO SALON
router.post("/add", async (req, res) => {
  try {
    console.log("BODY RECEIVED:", req.body);

    const { salonId, serviceName, price, duration } = req.body;

    const newService = new Service({
      salonId,
      serviceName,
      price,
      duration
    });

    await newService.save();

    res.status(201).json({ message: "Service added successfully" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

// GET SERVICES BY SALON
router.get("/:salonId", async (req, res) => {
  try {
    const services = await Service.find({ salonId: req.params.salonId });
    res.json(services);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;