// models/Item.js
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const ItemSchema = new mongoose.Schema({
    id: {
        type: String,
        default: uuidv4
    },
    rfid_tag: { type: String, required: true, unique: true, index: true },
    name: String,
    category: String,
    sku: { type: String, default: null },
    item_type: { type: String, default: "retail_merchandise" },
    value: Number,
    home_zone: String,
    current_zone: String,
    status: { type: String, default: "in_stock" },
    misplaced: { type: Boolean, default: false },
    notes: { type: String, default: null },
    created_by: String,
    created_at: { type: String },
    last_seen: { type: String },
    // created_at: { type: Date, default: Date.now },
    // last_seen: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Items", ItemSchema);