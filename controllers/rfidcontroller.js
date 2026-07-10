const Item = require("../models/Item");
const sendToEmergent = require("../services/emergent");
const { toPhilippineISOString } = require("../utils/time");

const FALLBACK_ZONE = "Receiving";

exports.receiveScan = async (req, res) => {
    try {
        const { deviceId, reads } = req.body;

        if (!Array.isArray(reads) || reads.length === 0) {
            return res.status(400).json({ error: "No reads provided" });
        }

        const processedReads = [];

        for (const read of reads) {
            const phTimestamp = toPhilippineISOString(read.timestamp);

            console.log("Scanned at (PH time):", phTimestamp);

            const previousItem = await Item.findOne({ rfid_tag: read.epc });
            const previousZone = previousItem ? previousItem.current_zone : null;

            const currentZone =
                read.zone ||
                //"Receiving" ||
                previousZone ||
                (previousItem ? previousItem.home_zone : null) ||
                FALLBACK_ZONE;

            const updatedItem = await Item.findOneAndUpdate(
                { rfid_tag: read.epc },
                {
                    $set: {
                        last_seen: phTimestamp,
                        current_zone: currentZone
                    },
                    $setOnInsert: {
                        name: "Unidentified Item",
                        category: "Uncategorized",
                        sku: null,
                        item_type: "retail_merchandise",
                        value: 0,
                        home_zone: currentZone,
                        status: "in_stock",
                        misplaced: false,
                        notes: `Auto-created from scan, device: ${deviceId || "RFD4031-G10B700-WR"}`,
                        created_by: "System",
                        created_at: phTimestamp
                    }
                },
                { upsert: true, new: true }
            );

            // RFIDScanEvent.create(...) disabled — no scan_events document written

            // Plain object standing in for what used to be the saved scan event,
            // so sendToEmergent still receives everything it needs.
            processedReads.push({
                rfid_tag: read.epc,
                item_id: updatedItem.id,
                item_name: updatedItem.name,
                reader_id: "RFD4031-G10B700-WR",
                zone: currentZone,
                previous_zone: previousZone,
                event_type: previousZone && previousZone !== currentZone ? "movement" : "scan",
                rssi: read.rssi,
                timestamp: phTimestamp
            });
        }

        await sendToEmergent(processedReads);

        res.json({ success: true, count: processedReads.length });

    } catch (err) {
        console.error("receiveScan error:", err);
        res.status(500).json({ error: err.message });
    }
};