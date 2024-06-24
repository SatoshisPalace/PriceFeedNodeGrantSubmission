import { Claim, ReclaimHTTPProvider, ResponseMatches, ResponseRedactions } from "satoshis-palace-reclaim-base";
import { ProviderSecretParams } from "@reclaimprotocol/witness-sdk";
import { HeaderMap, HTTPProviderParamsV2 } from "@reclaimprotocol/witness-sdk/lib/providers/http-provider";
import { HistoricalDataHandler } from "../api/coinmarketcap/HistoricalDataHandler";
import { MAX_RETRIES, TIME_OUT } from "../constants";
import { logger } from 'satoshis-palace-reclaim-base'
// SP.js / SHADE.js / SECRET.js all fight for window polyfills and it breaks reclaims fetch usage setting window to undefined resets all that
// @ts-ignore
window = undefined

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

        this.apiHandler = new HistoricalDataHandler(coinId, currency)
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

    protected getSercretParams(): ProviderSecretParams<typeof this.name> {

        const secretParams: ProviderSecretParams<typeof this.name> = {
            // authorisationHeader: this.apiHandler.getAuthHeader()
            headers: this.getHeaders()
        }
        return secretParams
    }

    private async getValueThatResponseIsExpectedToContain(): Promise<string> {
        // Get a single price point
        const minuteData = await this.apiHandler.getHistoricalMinuteData("1", this.timeStamp)
        return `price\":${minuteData.data[this.coinId].quotes[0].quote.USD.price}`;
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

    public createPriceClaim(time: string): Promise<Claim> {
        this.timeStamp = time
        return this.createClaim()
    }
}

export async function getPriceClaim(timeStamp: string): Promise<Claim> {
    let attempts = 0;
    let reclaimProvider = new PriceReclaim(process.env.PRIVATE_KEY!, process.env.COIN_ID!, process.env.DENOMINATED_COIN_ID!);

    while (attempts < MAX_RETRIES) {
        try {
            const claim = await reclaimProvider.createPriceClaim(timeStamp);
            logger.info(`Price claim created successfully\n
                        timestamp of price:${timeStamp}\n
                        identifier:${claim.identifier}`)
            return claim; // Successfully created claim, return it
        } catch (error) {
            logger.error(`Failed to create price claim on attempt ${attempts + 1}:`, error)
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