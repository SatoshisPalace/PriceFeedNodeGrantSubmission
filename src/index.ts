import { PriceReclaim } from './price-claim';
import { COIN_ID, DENOMINATED_COIN_ID, MAX_RETRIES, PRIVATE_KEY, REFRESH_INTERVAL, TIME_OUT } from './constants';

// Load environment variables

async function main() {
    let attempts = 0;

    async function attemptClaim() {
        try {
            let reclaimProvider = new PriceReclaim(PRIVATE_KEY!, COIN_ID, DENOMINATED_COIN_ID);
            const claim = await reclaimProvider.createPriceClaim("1714609347");
            console.log('Price claim created successfully.', claim);
            attempts = 0; // reset attempts after a successful claim
        } catch (error) {
            console.error(`Failed to create price claim on attempt ${attempts + 1}:`, error);
            if (++attempts < MAX_RETRIES) {
                setTimeout(attemptClaim, TIME_OUT); // Retry after a fraction of the interval
            } else {
                console.error('Max retries reached, will try again in next cycle.');
                attempts = 0; // reset attempts for the next cycle
            }
        }
    }

    setInterval(attemptClaim, REFRESH_INTERVAL); // Schedule the claim to run at the interval
    attemptClaim(); // Also run immediately on start
}

// Execute the main function
main();
