// models/RFIDEvent.js

const mongoose = require("mongoose");

const RFIDEventSchema = new mongoose.Schema({

    rfid_tag: String,
    name: String,
    category: String,
    sku: String,
    item_type: String,
    value: Number,
    home_zone: String,
    current_zone: String,
    status: String,
    notes: String,
    created_by: String,
    created_at: String,
    last_seen: String
    // created_at: Date,
    // last_seen: Date

    /*tagId: String,
    antenna: Number,
    reader: String,
    timestamp: Date,
    rssi: Number,
    phase: Number,
    seenCount: Number,
    processed: {
        type: Boolean,
        default: false
    }*/
});

module.exports = mongoose.model("items", RFIDEventSchema);