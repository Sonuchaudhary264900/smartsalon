const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");

router.post("/login", async (req, res) => {
  const { name, mobile, role } = req.body;

  let user = await User.findOne({ mobile });

  if (!user) {
    user = new User({ name, mobile, role });
    await user.save();
  }

  const token = jwt.sign(
    { id: user._id, role: user.role },
    "secretkey",
    { expiresIn: "1d" }
  );

  res.json({ token, user });
});

module.exports = router;