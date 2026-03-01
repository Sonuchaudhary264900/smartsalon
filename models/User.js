const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  mobile: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ["customer", "owner", "admin"],
    default: "customer"
  }
});

module.exports = mongoose.model("User", userSchema);