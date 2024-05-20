import { ReclaimHTTPProvider, ResponseMatches, ResponseRedactions } from "satoshis-palace-reclaim-base";
import { ProviderSecretParams, WitnessData } from "@reclaimprotocol/witness-sdk";
import { HeaderMap, HTTPProviderParamsV2 } from "@reclaimprotocol/witness-sdk/lib/providers/http-provider";
import { ProviderClaimData } from "@reclaimprotocol/witness-sdk/lib/proto/api";
import { HistoricalDataHandler } from "../api/coinmarketcap/HistoricalDataHandler";
import { MAX_RETRIES, TIME_OUT } from "../constants";

class PriceReclaim extends ReclaimHTTPProvider {
    method: 'GET' | 'POST' = 'GET';
    private private_key: string;
    private apiHandler: HistoricalDataHandler;
    private timeStamp!: string;
    private coinId: string;

    constructor(private_key: string, coinId: string, currency: string) {
        super();
        this.private_key = private_key
        this.coinId = coinId
        console.log(coinId)
        console.log(currency)

        this.apiHandler = new HistoricalDataHandler(coinId, currency)
        console.log(this.getUrl())
    }

    protected getUrl(): string {
        return this.apiHandler.getUrl();
    }

    protected getOwnerPrivateKey(): string {
        return this.private_key;
    }

    protected getHeaders(): HeaderMap | undefined {
        const headers = this.apiHandler.getHeaders();  // Assuming this returns a Fetch API Headers object

        if (!headers) {
            return undefined;
        }

        let headerMap: HeaderMap = {};
        headers.forEach((value, key) => {
            headerMap[key] = value;
        });

        return headerMap;
    }

    protected async getClaimParams(): Promise<HTTPProviderParamsV2> {
        const responseMatches = await this.getResponseMatches()
        const params: HTTPProviderParamsV2 = {
            url: this.getUrl(),
            method: this.method,
            responseRedactions: this.getResponseRedactions(),
            responseMatches,
            // headers: this.getHeaders()
        };
        return params;
    }

    protected getResponseRedactions(): ResponseRedactions[] {
        const responseRedactions: ResponseRedactions[] = [
            {
                jsonPath: `data.${this.coinId}`
            }
        ]

        return responseRedactions
    }

    protected getSercretParams(): ProviderSecretParams<typeof this.name> {

        const secretParams: ProviderSecretParams<typeof this.name> = {
            // authorisationHeader: this.apiHandler.getAuthHeader()
            headers: this.getHeaders()
        }
        return secretParams
    }

    private async getValueThatResponseIsExpectedToContain(): Promise<string> {
        // Get a single price point
        const minuteData = await this.apiHandler.getHistoricalMinuteData("2", this.timeStamp)
        const json = JSON.stringify(minuteData.data[this.coinId])
        return json;
    }

    protected async getResponseMatches(): Promise<ResponseMatches[]> {
        const responseMatches: ResponseMatches[] = [
            {
                type: "contains",
                // replace with response body
                value: await this.getValueThatResponseIsExpectedToContain()
            }
        ]
        return responseMatches
    }

    public createPriceClaim(time: string): Promise<{
        identifier: string;
        claimData: ProviderClaimData;
        signatures: string[];
        witnesses: WitnessData[];
    }> {
        this.timeStamp = time
        return this.createClaim()
    }
}

export async function getPriceClaim(timeStamp: string): Promise<{
    identifier: string;
    claimData: ProviderClaimData;
    signatures: string[];
    witnesses: WitnessData[];
}> {
    let attempts = 0;
    let reclaimProvider = new PriceReclaim(process.env.PRIVATE_KEY!, process.env.COIN_ID!, process.env.DENOMINATED_COIN_ID!);

    while (attempts < MAX_RETRIES) {
        try {
            const claim = await reclaimProvider.createPriceClaim(timeStamp);
            console.log('Price claim created successfully:', claim);
            return claim; // Successfully created claim, return it
        } catch (error) {
            console.error(`Failed to create price claim on attempt ${attempts + 1}:`, error);
            attempts++;
            if (attempts >= MAX_RETRIES) {
                throw new Error(`Max retries reached for timestamp ${timeStamp}. Unable to create price claim.`);
            }
            await new Promise(resolve => setTimeout(resolve, TIME_OUT)); // Delay before retrying
        }
    }
    // This line is technically unreachable due to the throw in the catch block above,
    // but it's here to satisfy TypeScript's need for a return on all code paths or an error thrown.
    throw new Error("Unexpected error in getPriceClaim function.");
}