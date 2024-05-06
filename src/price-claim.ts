import { ReclaimHTTPProvider, ResponseMatches, ResponseRedactions } from "satoshis-palace-reclaim-base";
import { ProviderSecretParams, WitnessData } from "@reclaimprotocol/witness-sdk";
import { HeaderMap, HTTPProviderParamsV2 } from "@reclaimprotocol/witness-sdk/lib/providers/http-provider";
import { CryptoCompareHistoricalDataHandler } from "./api/crypto-compare/CryptoCompareHistoricalDataHandler";
import { ProviderClaimData } from "@reclaimprotocol/witness-sdk/lib/proto/api";
import { CRYPTO_COMPARE_API_KEY } from "./api/crypto-compare/constants";

export class PriceReclaim extends ReclaimHTTPProvider {
    method: 'GET' | 'POST' = 'GET';
    private private_key: string;
    private apiHandler: CryptoCompareHistoricalDataHandler;
    private timeStamp!: string;

    constructor(private_key: string, coinId: string, currency: string) {
        super();
        this.private_key = private_key
        console.log(coinId)
        console.log(currency)

        this.apiHandler = new CryptoCompareHistoricalDataHandler(coinId, currency)
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
                jsonPath: "Data.Data"
            }
        ]

        return responseRedactions
    }

    protected getSercretParams(): ProviderSecretParams<typeof this.name> {

        const secretParams: ProviderSecretParams<typeof this.name> = {
            authorisationHeader: `Apikey ${CRYPTO_COMPARE_API_KEY}`
        }
        return secretParams
    }

    private async getValueThatResponseIsExpectedToContain(): Promise<string> {
        return JSON.stringify((await this.apiHandler.getHistoricalMinuteData("1", this.timeStamp)).Data.Data);
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
