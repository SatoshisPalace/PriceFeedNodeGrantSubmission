import { HTTPProviderParamsV2 } from "@reclaimprotocol/witness-sdk/lib/providers/http-provider";
import { getCoinGeckoPriceURL, getPriceFromCoinGecko } from "./coin-gecko";
import { createClaim, getBeacon } from "@reclaimprotocol/witness-sdk";
import { BeaconType } from "@reclaimprotocol/witness-sdk/lib/proto/api";

export async function getPriceClaimParams(coinId: string): Promise<HTTPProviderParamsV2> {
    const claim: HTTPProviderParamsV2 = {
        url: getCoinGeckoPriceURL(coinId),
        method: "GET",
        responseRedactions: [],
        responseMatches: [
            {
                type: "contains",
                // replace with response body
                value: String(await getPriceFromCoinGecko(coinId))
            }
        ]
    }
    return claim
}

export async function createReclaimPriceClaim(coinId: string) {
    const params = await getPriceClaimParams(coinId)
    const claim = await createClaim({
        name: 'http',
        params,
        secretParams: {
            cookieStr: 'abcd=xyz'
        },
        ownerPrivateKey: process.env.PRIVATE_KEY!,
        beacon: getBeacon({
            type: BeaconType.BEACON_TYPE_SMART_CONTRACT,
            id: "0x12c"
        })
    })
    return claim
}