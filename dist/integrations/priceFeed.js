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
exports.getTimesToPost = exports.postPrice = void 0;
const dist_1 = require("spjs/dist");
const secretjs_1 = require("secretjs");
const price_feed_1 = require("spjs/dist/modules/price-feed");
const time_1 = require("../utilities/time");
const logger_1 = require("../logger");
const constants_1 = require("../constants");
const crypto_1 = require("../utilities/crypto");
function postPrice(reclaimResponse) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        let secretJs = (0, dist_1.getSecretNetworkClient)();
        const priceFeed = new price_feed_1.PriceFeed(constants_1.PRICE_FEED_CONTRACT_INFO, secretJs);
        let proof = convertClaimToProof(reclaimResponse);
        let postPriceResponse = yield priceFeed.post_price(proof);
        if (postPriceResponse.code != secretjs_1.TxResultCode.Success) {
            throw new Error(`Failed To post proof of price:\n
            ${JSON.stringify(proof)} \n\n
            Response: \n
            ${JSON.stringify(postPriceResponse)}
            `);
        }
        logger_1.logger.info('Price Posted Successfully for claim with id:', (_a = reclaimResponse.claim) === null || _a === void 0 ? void 0 : _a.identifier);
    });
}
exports.postPrice = postPrice;
function getTimesToPost() {
    return __awaiter(this, void 0, void 0, function* () {
        const secretJs = (0, dist_1.getSecretNetworkClient)();
        const priceFeed = new price_feed_1.PriceFeed(constants_1.PRICE_FEED_CONTRACT_INFO, secretJs);
        try {
            const mostRecentPrice = yield priceFeed.get_most_recent_price();
            const lastTime = mostRecentPrice.most_recent_price_response.price_posting.time;
            const timesToPost = (0, time_1.calculateIntervals)(lastTime);
            return timesToPost;
        }
        catch ( // First Run, no prices available
        _a) { // First Run, no prices available
            const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
            const lastInterval = (0, time_1.getLastFiveMinuteInterval)(currentTime);
            const timesToPost = (0, time_1.calculateIntervals)(lastInterval);
            return timesToPost;
        }
    });
}
exports.getTimesToPost = getTimesToPost;
function convertClaimToProof(reclaimResponse) {
    let proof = {
        claimInfo: {
            context: reclaimResponse.claim.context,
            parameters: reclaimResponse.claim.parameters,
            provider: reclaimResponse.claim.provider
        },
        signedClaim: {
            claim: {
                epoch: reclaimResponse.claim.epoch,
                identifier: reclaimResponse.claim.identifier,
                owner: reclaimResponse.claim.owner,
                timestampS: reclaimResponse.claim.timestampS
            },
            signatures: [(0, crypto_1.uint8ArrayToHexString)(reclaimResponse.signatures.claimSignature)]
        }
    };
    return proof;
}
