/**
 * Converts a Date (or date-parsable value) into an ISO-8601 string
 * representing Philippine local time (UTC+8), e.g.
 *   "2026-07-06T18:00:00.000+08:00"
 *
 * Stored as a String field in MongoDB — NOT a native Date type,
 * since Date objects cannot carry timezone/offset information.
 */
function toPhilippineISOString(input) {
    const date = input instanceof Date ? input : new Date(input);
    const phOffsetMs = 8 * 60 * 60 * 1000; // UTC+8, no DST in the Philippines
    const shifted = new Date(date.getTime() + phOffsetMs);
    return shifted.toISOString().replace("Z", "+08:00");
}

module.exports = { toPhilippineISOString };