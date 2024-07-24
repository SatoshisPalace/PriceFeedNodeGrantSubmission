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
// @ts-ignore
require("spjs/dist/polyfills");
const integrations_1 = require("./integrations");
const time_1 = require("./utilities/time");
const logger_1 = require("./logger");
// Main function to initialize and continuously update contests and claims
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        logger_1.logger.info('='.repeat(75));
        logger_1.logger.info(`RUNNING PRICE POSTING JOB: ${new Date().toISOString()}`);
        logger_1.logger.info('='.repeat(75));
        try {
            const timesToPost = yield (0, integrations_1.getTimesToPost)();
            logger_1.logger.info(`Times to Post: ${timesToPost}`);
            for (let unixTime of timesToPost) {
                logger_1.logger.info('-'.repeat(75));
                const timestamp = (0, time_1.convertUnixToISO)(unixTime);
                logger_1.logger.info(`Posting price for: ${timestamp}`);
                const claim = yield (0, integrations_1.getPriceClaim)(timestamp);
                yield (0, integrations_1.postPrice)(claim);
                logger_1.logger.info('-'.repeat(75));
            }
        }
        catch (error) {
            logger_1.logger.error('FATAL! Failed to post find prove and post prices', error);
        }
        // Schedule the next run
        logger_1.logger.info('='.repeat(75));
        logger_1.logger.info(`COMPLETED PRICE POSTING JOB: ${new Date().toISOString()}`);
        logger_1.logger.info('='.repeat(75));
        setTimeout(main, (0, time_1.calculateNextRunDelay)());
    });
}
// Initial call to start the process
logger_1.logger.info('='.repeat(75));
logger_1.logger.info('STARTING CATCHUP');
logger_1.logger.info('='.repeat(75));
main();
