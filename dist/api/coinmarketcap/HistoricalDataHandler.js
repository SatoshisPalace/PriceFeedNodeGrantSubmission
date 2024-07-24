"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HistoricalDataHandler = void 0;
const logger_1 = require("../../logger");
const CoinMarketCapAPIHandler_1 = require("./CoinMarketCapAPIHandler");
class HistoricalDataHandler extends CoinMarketCapAPIHandler_1.CoinMarketCapAPIHandler {
    constructor(coinId, currency) {
        super();
        this.setEndpoint('v3/cryptocurrency/quotes/historical')
            .setCoinId(coinId)
            .setTargetCurrency(currency)
            .setInterval("5m");
    }
    getHistoricalMinuteData(limit, endTime) {
        return __awaiter(this, void 0, void 0, function* () {
            this.setLimit(limit)
                .setEndTime(endTime);
            try {
                const data = yield this.fetchData();
                logger_1.logger.info('-'.repeat(75));
                logger_1.logger.info('Successfully retrieved historical minute data from CoinMarketCap.');
                logger_1.logger.info('-'.repeat(75));
                return data;
            }
            catch (error) {
                logger_1.logger.error('Failed to retrieve historical minute data from CoinMarketCap:', error);
                throw error;
            }
        });
    }
}
exports.HistoricalDataHandler = HistoricalDataHandler;
