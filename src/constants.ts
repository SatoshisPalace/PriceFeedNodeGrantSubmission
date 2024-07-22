//src/constants.ts
import dotenv from 'dotenv';
dotenv.config();

export const TIME_OUT = 10000

export const REFRESH_INTERVAL = parseInt(process.env.REFRESH_INTERVAL || '300000'); // Default to 5 minutes if not set
export const MAX_RETRIES = parseInt(process.env.MAX_RETRIES || '3'); // Default to 3 retries if not set
export const COIN_ID = process.env.COIN_ID || 1; // Default to 'bitcoin' if not set
export const DENOMINATED_COIN_ID = process.env.DENOMINATED_COIN_ID || 'USD';
export const PRIVATE_KEY = process.env.PRIVATE_KEY
export const ADDITIONAL_SECONDS = parseInt(process.env.ADDITIONAL_SECONDS || "20"); // 20 seconds past the interval

export const INTERVAL_MINUTES = 5; // Interval of 5 minutes
export const SECONDS_PER_MINUTE = 60; // Number of seconds in a minute
export const MILLISECONDS_PER_SECOND = 1000; // Number of milliseconds in a second

export const BULL_VS_BEAR_CONTRACT_INFO = {
    code_hash: "a55a5fb9171a88ce4dde0664dc0df829ef3b522a04706320c5a6c3b3d6f316bb",
    address: "secret1chf8r0klvqs3hulggwearf4stxv2xcvtdajfh5"
};
export const PRICE_FEED_CONTRACT_INFO = {
    code_hash: "888c2d1cd64b2987817053ecc161bd19f17b108c8483ceb7b87d09ba22771099",
    address: "secret15fcwlhamhgt7tynf5llfd0xpa4c2c6pdegd5g0"
};
export const SNIP20_CONTRACT_INFO = {
    code_hash: "ef8fd7734b3d8a2f5372836955c73e41d111303576857efa8e2c8c898f1c906c",
    address: "secret1lfq3zvlvhrl3nlx074fcwrxdxlyhapt7gssxw4"
};