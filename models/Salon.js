// Import mongoose
const mongoose = require("mongoose");

// Create Salon Schema
const salonSchema = new mongoose.Schema({

  // Owner reference (linked to user collection)
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  // Salon basic info
  salonName: {
    type: String,
    required: true
  },

  location: {
    type: String,
    required: true
  },

  photo: {
    type: String
  },

  // Admin approval system
  approved: {
    type: Boolean,
    default: false
  },

  // Enable/disable booking
  active: {
    type: Boolean,
    default: true
  },

  /* =====================================================
     NEW FIELDS FOR SMART SLOT SYSTEM
  ===================================================== */

  // Working hours decided by owner
  workingHours: {
    start: {
      type: String,   // Example: "10:00"
      default: "10:00"
    },
    end: {
      type: String,   // Example: "18:00"
      default: "18:00"
    }
  },

  // Slot duration in minutes
  slotDuration: {
    type: Number,
    default: 30   // 30 minutes per slot by default
  }

}, { timestamps: true });

// Export model
module.exports = mongoose.model("Salon", salonSchema);