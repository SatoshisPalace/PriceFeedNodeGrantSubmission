import { HTTPProviderParamsV2 } from "@reclaimprotocol/witness-sdk/lib/providers/http-provider";
import { getCoinGeckoPriceURL, getPriceFromCoinGecko } from "./coin-gecko";
import { createClaim, getBeacon } from "@reclaimprotocol/witness-sdk";
import { ReclaimHTTPProvider, ResponseMatches } from "satoshis-palace-reclaim-base";

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
        // beacon: getBeacon({
        //     type: BeaconType.BEACON_TYPE_SMART_CONTRACT,
        //     id: "0xpulsar-3"
        // })
    })
    return claim
}

export class PriceReclaimHTTPProvider extends ReclaimHTTPProvider {
    method: 'GET' | 'POST' = 'GET';
    private coinId: string;

    constructor(coinId: string) {
        super();
        this.coinId = coinId;
    }

    protected getUrl(): string {
        return getCoinGeckoPriceURL(this.coinId);
    }

    protected getOwnerPrivateKey(): string {
        return process.env.PRIVATE_KEY!;
    }

    protected async getResponseMatches(): Promise<ResponseMatches[]> {
        const responseMatches: ResponseMatches[] = [
            {
                type: "contains",
                // replace with response body
                value: String(await getPriceFromCoinGecko(this.coinId))
            }
        ]
        return responseMatches
    }

    // Optional: Override any other methods as required for additional customization
}
