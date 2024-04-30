//src/constants.ts
export const TIME_OUT = 1000

export const REFRESH_INTERVAL = parseInt(process.env.REFRESH_INTERVAL || '300000'); // Default to 5 minutes if not set
export const MAX_RETRIES = parseInt(process.env.MAX_RETRIES || '3'); // Default to 3 retries if not set
export const COIN_ID = process.env.COIN_ID || 'bitcoin'; // Default to 'bitcoin' if not set
export const PRIVATE_KEY = process.env.PRIVATE_KEY
