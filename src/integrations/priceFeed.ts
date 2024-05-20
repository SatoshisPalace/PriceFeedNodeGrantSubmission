import { getSecretNetworkClient } from "spjs/dist";
import { TxResultCode } from 'secretjs';
import { PriceFeed, Proof } from "spjs/dist/modules/price-feed";
import { contractInfo as priceFeedInfo } from 'spjs/dist/deployment/artifacts/price-feed-info'
import { ProviderClaimData } from "@reclaimprotocol/witness-sdk/lib/proto/api";
import { WitnessData } from "@reclaimprotocol/witness-sdk";

export async function postPrice(claim: {
    identifier: string;
    claimData: ProviderClaimData;
    signatures: string[];
    witnesses: WitnessData[];
}) {
    let secretJs = getSecretNetworkClient();
    const priceFeed = new PriceFeed(priceFeedInfo, secretJs)

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