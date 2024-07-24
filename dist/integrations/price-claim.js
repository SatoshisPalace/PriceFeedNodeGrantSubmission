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
exports.getPriceClaim = void 0;
// SP.js / SHADE.js / SECRET.js // Reclaim-Witness-SDK all fight for window polyfills and it breaks reclaims fetch usage setting window to undefined resets all that
// @ts-ignore
window = undefined;
const zk_fetch_1 = require("zk-fetch");
const HistoricalDataHandler_1 = require("../api/coinmarketcap/HistoricalDataHandler");
const constants_1 = require("../constants");
const logger_1 = require("../logger");
class PriceReclaim {
    constructor(coinId, currency) {
        this.method = 'GET';
        this.coinId = coinId;
        this.apiHandler = new HistoricalDataHandler_1.HistoricalDataHandler(coinId, currency);
    }
    getReclaimClient() {
        return new zk_fetch_1.ReclaimClient(process.env.RECLAIM_CLIENT_ADDRESS, process.env.RECLAIM_CLIENT_SECRET);
    }
    setTime(unixTimeStamp) {
        this.timeStamp = unixTimeStamp;
        this.apiHandler.setEndTime(unixTimeStamp);
    }
    getUrl() {
        return this.apiHandler.getUrl();
    }
    getHeaders() {
        const headers = this.apiHandler.getHeaders(); // Assuming this returns a Fetch API Headers object
        if (!headers) {
            return undefined;
        }
        let headerMap = {};
        headers.forEach((value, key) => {
            headerMap[key] = value;
        });
        return headerMap;
    }
    getValueThatResponseIsExpectedToContain() {
        return __awaiter(this, void 0, void 0, function* () {
            // Get a single price point
            const minuteData = yield this.apiHandler.getHistoricalMinuteData("1", this.timeStamp);
            return `price\":${minuteData.data[this.coinId].quotes[0].quote.USD.price}`;
        });
    }
    getResponseMatches() {
        return __awaiter(this, void 0, void 0, function* () {
            const responseMatches = [
                {
                    type: "contains",
                    // replace with response body
                    value: yield this.getValueThatResponseIsExpectedToContain()
                }
            ];
            return responseMatches;
        });
    }
    getPublicOptions() {
        const publicOptions = {
            method: this.method
        };
        return publicOptions;
    }
    getSecretOptions() {
        const secretParams = {
            headers: this.getHeaders()
        };
        return secretParams;
    }
    createPriceClaim(unixTimeStamp) {
        return __awaiter(this, void 0, void 0, function* () {
            this.setTime(unixTimeStamp);
            const responseMatches = yield this.getResponseMatches(); //Sets url so must be run first
            const url = this.getUrl();
            const client = this.getReclaimClient();
            return (yield client.zkFetch(url, this.getPublicOptions(), this.getSecretOptions(), 1, 1, responseMatches));
        });
    }
}
function getPriceClaim(timeStamp) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        let attempts = 0;
        let reclaimProvider = new PriceReclaim(process.env.COIN_ID, process.env.DENOMINATED_COIN_ID);
        while (attempts < constants_1.MAX_RETRIES) {
            try {
                const claim = yield reclaimProvider.createPriceClaim(timeStamp);
                if (claim) {
                    logger_1.logger.info(`Price claim created successfully\n
                timestamp of price:${timeStamp}\n
                identifier:${(_a = claim.claim) === null || _a === void 0 ? void 0 : _a.identifier}`);
                    return claim; // Successfully created claim, return it
                }
                else {
                    throw new Error("Could not create claim");
                }
            }
            catch (error) {
                logger_1.logger.error(`Failed to create price claim on attempt ${attempts + 1}:`, error);
                attempts++;
                if (attempts >= constants_1.MAX_RETRIES) {
                    throw new Error(`Max retries reached for timestamp ${timeStamp}. Unable to create price claim.`);
                }
                yield new Promise(resolve => setTimeout(resolve, constants_1.TIME_OUT)); // Delay before retrying
            }
        }
        // This line is technically unreachable due to the throw in the catch block above,
        // but it's here to satisfy TypeScript's need for a return on all code paths or an error thrown.
        throw new Error("Unexpected error in getPriceClaim function.");
    });
}
exports.getPriceClaim = getPriceClaim;
