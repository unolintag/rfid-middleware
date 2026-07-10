// models/UnidentifiedTag.js
const mongoose = require("mongoose");

const UnidentifiedTagSchema = new mongoose.Schema({
    rfid_tag: { type: String, required: true, unique: true, index: true },
    first_seen: { type: String },
    last_seen: { type: String },
    //first_seen: { type: Date, default: Date.now },
    //last_seen: { type: Date, default: Date.now },
    seen_count: { type: Number, default: 1 },
    last_zone: String,       // wherever it was scanned, if you track zones per reader
    last_device: String,     // which handheld/reader saw it
    status: { type: String, default: "pending_review" }, // pending_review | resolved | ignored
    resolved_item_id: { type: String, default: null }    // link to Item.id once someone assigns it
});

module.exports = mongoose.model("UnidentifiedTag", UnidentifiedTagSchema);