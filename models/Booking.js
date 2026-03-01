const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    salonId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Salon"
    },
    serviceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service"
    },
    date: String,
    timeSlot: String,
    status: {
        type: String,
        enum: ["booked", "cancelled", "completed"],
        default: "booked"
    }
});

module.exports = mongoose.model("Booking", bookingSchema);