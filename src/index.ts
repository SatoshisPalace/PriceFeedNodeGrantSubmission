// @ts-ignore
import 'spjs/dist/polyfills'

import { getTimesToPost, postPrice, getPriceClaim } from './integrations';
import { convertUnixToISO, calculateNextRunDelay } from './time';
import { logger } from 'satoshis-palace-reclaim-base'



// Main function to initialize and continuously update contests and claims
async function main(): Promise<void> {
    logger.info('='.repeat(75));
    logger.info(`RUNNING PRICE POSTING JOB: ${new Date().toISOString()}`);
    logger.info('='.repeat(75));

    try {
        const timesToPost = await getTimesToPost();
        for (let unixTime of timesToPost) {
            const timestamp = convertUnixToISO(unixTime)
            const claim = await getPriceClaim(timestamp);
            await postPrice(claim);
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