import { getPriceClaim, getTimesToPost, postPrice } from './integrations';
import { convertUnixToISO, calculateNextRunDelay } from './time';



// Main function to initialize and continuously update contests and claims
async function main(): Promise<void> {

    console.log()
    try {
        const timesToPost = await getTimesToPost();
        for (let unixTime of timesToPost) {
            const timestamp = convertUnixToISO(unixTime)
            const claim = await getPriceClaim(timestamp);
            await postPrice(claim);
        }
    } catch (error) {
        console.error('Failed to fetch active contests:', error);
    }
    // Schedule the next run
    setTimeout(main, calculateNextRunDelay());
}

// Initial call to start the process
main()