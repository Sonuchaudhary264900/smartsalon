const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
    salonId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Salon"
    },
    serviceName: String,
    price: Number,
    duration: Number
});

module.exports = mongoose.model("Service", serviceSchema);