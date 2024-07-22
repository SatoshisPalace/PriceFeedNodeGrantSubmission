import { getSecretNetworkClient } from "spjs/dist";
import { TxResultCode } from 'secretjs';
import { PriceFeed, Proof } from "spjs/dist/modules/price-feed";
import { calculateIntervals, getLastFiveMinuteInterval } from "../utilities/time";
import { logger } from "../logger";
import {  ClaimTunnelResponse }  from '@reclaimprotocol/witness-sdk/lib/proto/api';

import * as _reclaimprotocol_witness_sdk from '@reclaimprotocol/witness-sdk/lib/types';
import * as _reclaimprotocol_witness_sdk_lib_proto_api from '@reclaimprotocol/witness-sdk/lib/proto/api';
import { PRICE_FEED_CONTRACT_INFO } from "../constants";
import { uint8ArrayToHexString } from "../utilities/crypto";

export async function postPrice(reclaimResponse: ClaimTunnelResponse) {
    let secretJs = getSecretNetworkClient();
    const priceFeed = new PriceFeed(PRICE_FEED_CONTRACT_INFO, secretJs)

    let proof = convertClaimToProof(reclaimResponse);
    let postPriceResponse = await priceFeed.post_price(proof)
    if (postPriceResponse.code != TxResultCode.Success) {
        throw new Error(`Failed To post proof of price:\n
            ${JSON.stringify(proof)} \n\n
            Response: \n
            ${JSON.stringify(postPriceResponse)}
            `
        );
    }
    logger.info('Price Posted Successfully for claim with id:', reclaimResponse.claim?.identifier)
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

function convertClaimToProof(reclaimResponse: ClaimTunnelResponse): Proof {
    let proof: Proof = {
        claimInfo: {
            context: reclaimResponse.claim!.context,
            parameters: reclaimResponse.claim!.parameters,
            provider: reclaimResponse.claim!.provider
        },
        signedClaim: {
            claim: {
                epoch: reclaimResponse.claim!.epoch,
                identifier: reclaimResponse.claim!.identifier,
                owner: reclaimResponse.claim!.owner,
                timestampS: reclaimResponse.claim!.timestampS
            },
            signatures: [uint8ArrayToHexString(reclaimResponse.signatures!.claimSignature)]
        }
    }
    return proof
}