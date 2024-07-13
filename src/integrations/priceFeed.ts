import { getSecretNetworkClient } from "spjs/dist";
import { TxResultCode } from 'secretjs';
import { PriceFeed, Proof } from "spjs/dist/modules/price-feed";
import { contractInfo as priceFeedInfo } from 'spjs/dist/deployment/artifacts/price-feed-info'
import { ProviderClaimData } from "@reclaimprotocol/witness-sdk/lib/proto/api";
import { WitnessData } from "@reclaimprotocol/witness-sdk";
import { Claim, logger } from 'satoshis-palace-reclaim-base'
import { calculateIntervals, getLastFiveMinuteInterval } from "../time";
import { PRICE_FEED_CONTRACT_INFO } from "../constants";

export async function postPrice(claim: Claim) {
    let secretJs = getSecretNetworkClient();
    const priceFeed = new PriceFeed(PRICE_FEED_CONTRACT_INFO, secretJs)

    let proof = convertClaimToProof(claim);
    let postPriceResponse = await priceFeed.post_price(proof)
    if (postPriceResponse.code != TxResultCode.Success) {
        throw new Error(`Failed To post proof of price:\n
            ${JSON.stringify(proof)} \n\n
            Response: \n
            ${JSON.stringify(postPriceResponse)}
            `
        );
    }
    logger.info('Price Posted Successfully for claim with id:', claim.identifier)
}

export async function getTimesToPost(): Promise<number[]> {
    const secretJs = getSecretNetworkClient();
    const priceFeed = new PriceFeed(PRICE_FEED_CONTRACT_INFO, secretJs);

    try {
        const mostRecentPrice = await priceFeed.get_most_recent_price();
        const lastTime = mostRecentPrice.most_recent_price_response.price_posting.time;
        const timesToPost = calculateIntervals(lastTime);
        return timesToPost;
    } catch { // First Run, no prices available
        const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
        const lastInterval = getLastFiveMinuteInterval(currentTime);
        const timesToPost = calculateIntervals(lastInterval);
        return timesToPost;
    }
}

function convertClaimToProof(claim: {
    identifier: string;
    claimData: ProviderClaimData;
    signatures: string[];
    witnesses: WitnessData[];
}): Proof {
    let proof: Proof = {
        claimInfo: {
            context: claim.claimData.context,
            parameters: claim.claimData.parameters,
            provider: claim.claimData.provider
        },
        signedClaim: {
            claim: {
                epoch: claim.claimData.epoch,
                identifier: claim.identifier,
                owner: claim.claimData.owner,
                timestampS: claim.claimData.timestampS
            },
            signatures: claim.signatures
        }
    }
    return proof
}