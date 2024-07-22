"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoinMarketCapAPIHandler = void 0;
const BaseAPIHandler_1 = require("../BaseAPIHandler");
const constants_1 = require("./constants");
class CoinMarketCapAPIHandler extends BaseAPIHandler_1.BaseAPIHandler {
    constructor() {
        super(constants_1.COIN_MARKET_CAP_BASE_URL);
        this.setHeader('accept', 'application/json')
            .setHeader('X-CMC_PRO_API_KEY', `${constants_1.COIN_MARKET_CAP_API_KEY}`);
    }
    setTargetCurrency(currency) {
        this.setQueryParam('convert', currency);
        return this;
    }
    setCoinId(coinId) {
        this.setQueryParam('id', coinId);
        return this;
    }
    setLimit(limit) {
        this.setQueryParam('count', limit);
        return this;
    }
    setEndTime(unixTimeStamp) {
        this.setQueryParam('time_end', unixTimeStamp);
        return this;
    }
    setInterval(interval) {
        this.setQueryParam('interval', interval);
        return this;
    }
    getAuthHeader() {
        return `${constants_1.COIN_MARKET_CAP_API_KEY}`;
    }
}
exports.CoinMarketCapAPIHandler = CoinMarketCapAPIHandler;
