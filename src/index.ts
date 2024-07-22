// @ts-ignore
import 'spjs/dist/polyfills'

import { getTimesToPost, postPrice, getPriceClaim } from './integrations';
import { convertUnixToISO, calculateNextRunDelay } from './utilities/time';
import { logger } from './logger';



// Main function to initialize and continuously update contests and claims
async function main(): Promise<void> {
    logger.info('='.repeat(75));
    logger.info(`RUNNING PRICE POSTING JOB: ${new Date().toISOString()}`);
    logger.info('='.repeat(75));

    try {
        const timesToPost = await getTimesToPost();
        logger.info(`Times to Post: ${timesToPost}`);
        for (let unixTime of timesToPost) {
            logger.info('-'.repeat(75));
            const timestamp = convertUnixToISO(unixTime)
            logger.info(`Posting price for: ${timestamp}`);
            const claim = await getPriceClaim(timestamp);
            await postPrice(claim);
            logger.info('-'.repeat(75));

        }
    } catch (error) {
        logger.error('FATAL! Failed to post find prove and post prices', error)
    }
    // Schedule the next run
    logger.info('='.repeat(75));
    logger.info(`COMPLETED PRICE POSTING JOB: ${new Date().toISOString()}`);
    logger.info('='.repeat(75));
    setTimeout(main, calculateNextRunDelay());
}

// Initial call to start the process
logger.info('='.repeat(75))
logger.info('STARTING CATCHUP')
logger.info('='.repeat(75))

main()