import dotenv from 'dotenv';
dotenv.config();
export const COIN_MARKET_CAP_BASE_URL = "https://pro-api.coinmarketcap.com/"
export const COIN_MARKET_CAP_API_KEY = process.env.COIN_MARKET_CAP_API_KEY