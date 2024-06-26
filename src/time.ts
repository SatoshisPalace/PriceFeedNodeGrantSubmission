import { ADDITIONAL_SECONDS, INTERVAL_MINUTES, MILLISECONDS_PER_SECOND, SECONDS_PER_MINUTE } from "./constants";

/**
 * Converts a Unix timestamp to an ISO 8601 formatted string.
 * @param unixTime The Unix timestamp in seconds.
 * @returns The ISO 8601 formatted string.
 */
export function convertUnixToISO(unixTime: number): string {
    return new Date(unixTime * 1000).toISOString();
}

/**
 * Calculates the delay until the next 5-minute mark plus an additional 15 seconds.
 * @returns The delay in milliseconds.
 */
export function calculateNextRunDelay(): number {
    const now = new Date();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    // Calculate minutes and seconds until the next 5-minute mark
    const minutesUntilNextInterval = INTERVAL_MINUTES - (minutes % INTERVAL_MINUTES);
    const secondsUntilNextInterval = (minutesUntilNextInterval * SECONDS_PER_MINUTE) - seconds + ADDITIONAL_SECONDS;

    return secondsUntilNextInterval * MILLISECONDS_PER_SECOND;
}

/**
 * Calculates 5-minute intervals between the start time and now.
 * @param startTime The Unix timestamp in seconds from which to start calculating.
 * @returns An array of Unix timestamps in seconds.
 */
export function calculateIntervals(startTime: number): number[] {
    const intervals = [];
    const now = Math.floor(Date.now() / 1000); // Current time in seconds

    // Calculate the next 5-minute interval after startTime
    let nextTime = startTime - (startTime % (INTERVAL_MINUTES * SECONDS_PER_MINUTE)) + (INTERVAL_MINUTES * SECONDS_PER_MINUTE);

    for (let time = nextTime; time <= now; time += (INTERVAL_MINUTES * SECONDS_PER_MINUTE)) {
        intervals.push(time);
    }

    return intervals;
}