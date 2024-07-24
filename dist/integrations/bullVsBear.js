"use strict";
// import { getSecretNetworkClient } from 'spjs/dist';
// import { contractInfo as bullVsBearInfo } from 'spjs/dist/deployment/artifacts/bullvsbear-info'
// import { contractInfo as snip20Info } from 'spjs/dist/deployment/artifacts/snip20-info'
// import { BullVsBear } from 'spjs/dist/modules/bullvsbear';
// import { MAX_RETRIES, TIME_OUT } from '../constants';
// import { logger } from 'satoshis-palace-reclaim-base'
// export async function getTimesToPost(): Promise<number[]> {
//     let attempts = 0;
//     let secretJs = getSecretNetworkClient();
//     const bullVsBear = new BullVsBear(bullVsBearInfo, snip20Info, secretJs);
//     // await bullVsBear.betContest("BTC", 1, "100") // For testing, always places a bet
//     while (attempts < MAX_RETRIES) {
//         try {
//             let response = await bullVsBear.getTimesToResolve();
//             logger.info(response)
//             let prices: number[] = response.times_to_resolve.times
//             return prices
//         } catch (error) {
//             attempts++;
//             logger.error(`Attempt ${attempts} failed: ${error}`);
//             if (attempts >= MAX_RETRIES) {
//                 throw new Error("Failed to fetch needed prices after maximum retries.");
//             }
//             await new Promise(resolve => setTimeout(resolve, TIME_OUT)); // Wait before retrying
//         }
//     }
//     // This line is technically unreachable due to the throw in the catch block,
//     // but it's here to satisfy TypeScript's need for a return on all code paths.
//     throw new Error("Unexpected error in getTimesToPost function.");
// }
