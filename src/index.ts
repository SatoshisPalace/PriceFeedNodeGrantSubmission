import dotenv from 'dotenv';
import { createReclaimPriceClaim } from './price-claim';

// Load environment variables
dotenv.config();

// Define the main function as an asynchronous function
async function main() {
    const coinId = 'bitcoin'; // This should be dynamically set based on your use-case

    try {
        // Attempt to create a price claim
        const claim = await createReclaimPriceClaim(coinId);
        console.log('Price claim created successfully.');
        console.log(claim)
    } catch (error) {
        // Error handling
        console.error('Failed to create price claim:', error);
    }
}

// Execute the main function
main();
