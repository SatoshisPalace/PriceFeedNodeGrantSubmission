
// SP.js / SHADE.js / SECRET.js // Reclaim-Witness-SDK all fight for window polyfills and it breaks reclaims fetch usage setting window to undefined resets all that
// @ts-ignore
window = undefined

import { ReclaimClient } from "zk-fetch"
import { ClaimTunnelResponse } from '@reclaimprotocol/witness-sdk/lib/proto/api';

import { HistoricalDataHandler } from "../api/coinmarketcap/HistoricalDataHandler";
import { MAX_RETRIES, TIME_OUT } from "../constants";
import { Options, ResponseMatches, secretOptions } from "./reclaim-types";
import { logger } from '../logger';


class PriceReclaim {
    method: 'GET' | 'POST' = 'GET';
    private apiHandler: HistoricalDataHandler;
    private timeStamp!: string;
    private coinId: string;

    constructor(coinId: string, currency: string) {
        this.coinId = coinId

        this.apiHandler = new HistoricalDataHandler(coinId, currency)
    }

    private getReclaimClient(): ReclaimClient {
        return new ReclaimClient(
            process.env.RECLAIM_CLIENT_ADDRESS as string,
            process.env.RECLAIM_CLIENT_SECRET as string
        );
    }

    private setTime(unixTimeStamp: string) {
        this.timeStamp = unixTimeStamp;
        this.apiHandler.setEndTime(unixTimeStamp)
    }

    protected getUrl(): string {
        return this.apiHandler.getUrl();
    }

    protected getHeaders(): {
        [key: string]: string;
    } | undefined {
        const headers = this.apiHandler.getHeaders();  // Assuming this returns a Fetch API Headers object

        if (!headers) {
            return undefined;
        }

        let headerMap: {
            [key: string]: string;
        } = {};
        headers.forEach((value, key) => {
            headerMap[key] = value;
        });

        return headerMap;
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

    protected getPublicOptions(): Options | undefined {
        const publicOptions: Options = {
            method: this.method
        }
        return publicOptions
    }

    protected getSecretOptions(): secretOptions | undefined {
        const secretParams: secretOptions = {
            headers: this.getHeaders()
        }
        return secretParams
    }

    public async createPriceClaim(unixTimeStamp: string): Promise<ClaimTunnelResponse | undefined> {
        this.setTime(unixTimeStamp)
        const responseMatches = await this.getResponseMatches()//Sets url so must be run first
        const url = this.getUrl()
        const client = this.getReclaimClient()
        return (await client.zkFetch(
            url,
            this.getPublicOptions(),
            this.getSecretOptions(),
            1,
            1,
            responseMatches
        ))
    }
}

export async function getPriceClaim(timeStamp: string): Promise<ClaimTunnelResponse> {
    let attempts = 0;
    let reclaimProvider = new PriceReclaim(process.env.COIN_ID!, process.env.DENOMINATED_COIN_ID!);

    while (attempts < MAX_RETRIES) {
        try {
            const claim = await reclaimProvider.createPriceClaim(timeStamp);
            if (claim) {
                logger.info(`Price claim created successfully\n
                timestamp of price:${timeStamp}\n
                identifier:${claim.claim?.identifier}`)
                return claim; // Successfully created claim, return it
            } else {
                throw new Error("Could not create claim")
            }

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