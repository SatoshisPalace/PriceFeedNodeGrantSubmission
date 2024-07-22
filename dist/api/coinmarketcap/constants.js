"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.COIN_MARKET_CAP_API_KEY = exports.COIN_MARKET_CAP_BASE_URL = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.COIN_MARKET_CAP_BASE_URL = "https://pro-api.coinmarketcap.com/";
exports.COIN_MARKET_CAP_API_KEY = process.env.COIN_MARKET_CAP_API_KEY;
