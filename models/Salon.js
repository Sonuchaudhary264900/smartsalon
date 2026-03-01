const mongoose = require("mongoose");

const salonSchema = new mongoose.Schema({
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    salonName: String,
    location: String,
    photo: String,
    approved: {
        type: Boolean,
        default: false
    },
    active: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model("Salon", salonSchema);