"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SNIP20_CONTRACT_INFO = exports.PRICE_FEED_CONTRACT_INFO = exports.BULL_VS_BEAR_CONTRACT_INFO = exports.MILLISECONDS_PER_SECOND = exports.SECONDS_PER_MINUTE = exports.INTERVAL_MINUTES = exports.ADDITIONAL_SECONDS = exports.DENOMINATED_COIN_ID = exports.COIN_ID = exports.MAX_RETRIES = exports.REFRESH_INTERVAL = exports.TIME_OUT = void 0;
//src/constants.ts
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.TIME_OUT = 10000;
exports.REFRESH_INTERVAL = parseInt(process.env.REFRESH_INTERVAL || '300000'); // Default to 5 minutes if not set
exports.MAX_RETRIES = parseInt(process.env.MAX_RETRIES || '5'); // Default to 3 retries if not set
exports.COIN_ID = process.env.COIN_ID || 1; // Default to 'bitcoin' if not set
exports.DENOMINATED_COIN_ID = process.env.DENOMINATED_COIN_ID || 'USD';
exports.ADDITIONAL_SECONDS = parseInt(process.env.ADDITIONAL_SECONDS || "40"); // 20 seconds past the interval
exports.INTERVAL_MINUTES = 5; // Interval of 5 minutes
exports.SECONDS_PER_MINUTE = 60; // Number of seconds in a minute
exports.MILLISECONDS_PER_SECOND = 1000; // Number of milliseconds in a second
exports.BULL_VS_BEAR_CONTRACT_INFO = {
    code_hash: "a55a5fb9171a88ce4dde0664dc0df829ef3b522a04706320c5a6c3b3d6f316bb",
    address: "secret1chf8r0klvqs3hulggwearf4stxv2xcvtdajfh5"
};
exports.PRICE_FEED_CONTRACT_INFO = {
    code_hash: "888c2d1cd64b2987817053ecc161bd19f17b108c8483ceb7b87d09ba22771099",
    address: "secret15fcwlhamhgt7tynf5llfd0xpa4c2c6pdegd5g0"
};
exports.SNIP20_CONTRACT_INFO = {
    code_hash: "ef8fd7734b3d8a2f5372836955c73e41d111303576857efa8e2c8c898f1c906c",
    address: "secret1lfq3zvlvhrl3nlx074fcwrxdxlyhapt7gssxw4"
};
