"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLastFiveMinuteInterval = exports.calculateIntervals = exports.calculateNextRunDelay = exports.convertUnixToISO = void 0;
const constants_1 = require("../constants");
/**
 * Converts a Unix timestamp to an ISO 8601 formatted string.
 * @param unixTime The Unix timestamp in seconds.
 * @returns The ISO 8601 formatted string.
 */
function convertUnixToISO(unixTime) {
    return new Date(unixTime * 1000).toISOString();
}
exports.convertUnixToISO = convertUnixToISO;
/**
 * Calculates the delay until the next 5-minute mark plus an additional 15 seconds.
 * @returns The delay in milliseconds.
 */
function calculateNextRunDelay() {
    const now = new Date();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    // Calculate minutes and seconds until the next 5-minute mark
    const minutesUntilNextInterval = constants_1.INTERVAL_MINUTES - (minutes % constants_1.INTERVAL_MINUTES);
    const secondsUntilNextInterval = (minutesUntilNextInterval * constants_1.SECONDS_PER_MINUTE) - seconds + constants_1.ADDITIONAL_SECONDS;
    return secondsUntilNextInterval * constants_1.MILLISECONDS_PER_SECOND;
}
exports.calculateNextRunDelay = calculateNextRunDelay;
/**
 * Calculates 5-minute intervals between the start time and now.
 * @param startTime The Unix timestamp in seconds from which to start calculating.
 * @returns An array of Unix timestamps in seconds.
 */
function calculateIntervals(startTime) {
    const intervals = [];
    const now = Math.floor(Date.now() / 1000); // Current time in seconds
    // Calculate the next 5-minute interval after startTime
    let nextTime = startTime - (startTime % (constants_1.INTERVAL_MINUTES * constants_1.SECONDS_PER_MINUTE)) + (constants_1.INTERVAL_MINUTES * constants_1.SECONDS_PER_MINUTE);
    for (let time = nextTime; time <= now; time += (constants_1.INTERVAL_MINUTES * constants_1.SECONDS_PER_MINUTE)) {
        intervals.push(time);
    }
    return intervals;
}
exports.calculateIntervals = calculateIntervals;
/**
 * Gets the last 5-minute interval before the given time.
 * @param currentTime The current Unix timestamp in seconds.
 * @returns The Unix timestamp in seconds of the last 5-minute interval.
 */
function getLastFiveMinuteInterval(currentTime) {
    return currentTime - 2 * (currentTime % (constants_1.INTERVAL_MINUTES * constants_1.SECONDS_PER_MINUTE));
}
exports.getLastFiveMinuteInterval = getLastFiveMinuteInterval;
