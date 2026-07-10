const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const RFIDScanEventSchema = new mongoose.Schema({
    id: {
        type: String,
        default: uuidv4
    },
    rfid_tag: { type: String, required: true, index: true },
    item_id: { type: String, default: null },
    item_name: { type: String, default: null },
    reader_id: { type: String, default: null },
    zone: { type: String, default: null },
    previous_zone: { type: String, default: null },
    event_type: { type: String, default: "movement" }, // e.g. movement, scan, alert
    rssi: Number,
    timestamp: { type: String } // now stores PH-offset ISO string, not a Date
    //timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("rfid_scan_events", RFIDScanEventSchema);