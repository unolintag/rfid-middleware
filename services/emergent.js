/*module.exports = async (event) => {
    console.log("Sending to Emergent AI...");
    console.log(event);
};

*/

const axios = require("axios");

const EMERGENT_BASE_URL = process.env.EMERGENT_BASE_URL || "https://asset-identification.preview.emergentagent.com";
const EMERGENT_API_KEY = process.env.EMERGENT_API_KEY || ""; // matches RFID_API_KEY in Emergent's .env

/**
 * Relays created scan events to the Emergent FastAPI backend's
 * POST /api/rfid/scan/batch endpoint. Emergent expects a bare array
 * of { tag_id, reader_id, zone, rssi, timestamp } objects — different
 * field names than our internal RFIDScanEvent schema, so we map them here.
 */
module.exports = async (events) => {
    if (!Array.isArray(events) || events.length === 0) return;

    const payload = events.map(ev => ({
        tag_id: ev.rfid_tag,
        reader_id: ev.reader_id,
        zone: ev.zone,
        rssi: ev.rssi,
        timestamp: ev.timestamp
    }));

    try {
        const response = await axios.post(
            `${EMERGENT_BASE_URL}/api/rfid/scan/batch`,
            payload,
            {
                headers: {
                    "Content-Type": "application/json",
                    ...(EMERGENT_API_KEY ? { "X-API-Key": EMERGENT_API_KEY } : {})
                },
                timeout: 5000
            }
        );

        console.log(`Sent ${payload.length} event(s) to Emergent — processed: ${response.data.processed}`);
    } catch (err) {
        console.error("Failed to send to Emergent:", err.response ? err.response.data : err.message);
        // Intentionally not re-throwing — a failed relay shouldn't fail the whole /rfid/scan request,
        // since the data is already safely saved locally in RFIDScanEvent/Item.
    }
};