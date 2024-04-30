import { ReclaimHTTPProvider, ResponseMatches } from "satoshis-palace-reclaim-base";
import { HistoricalChartDataHandler } from "./api/coin-gecko/HistoricalDataHandler";

export class PriceReclaimHTTPProvider extends ReclaimHTTPProvider {
    method: 'GET' | 'POST' = 'GET';
    private coinId: string;
    private apiHandler: HistoricalChartDataHandler;

    constructor(coinId: string) {
        super();
        this.coinId = coinId;
        this.apiHandler = new HistoricalChartDataHandler(coinId)
    }

    protected getUrl(): string {
        return this.apiHandler.getUrl();
    }

    protected getOwnerPrivateKey(): string {
        return process.env.PRIVATE_KEY!;
    }

    private getValueThatResponseIsExpectedToContain(): string {
        this.apiHandler.fetchData()
    }

    protected async getResponseMatches(): Promise<ResponseMatches[]> {
        const responseMatches: ResponseMatches[] = [
            {
                type: "contains",
                // replace with response body
                value: String(this.apiHandler.fetchData())
            }
        ]
        return responseMatches
    }

    // Optional: Override any other methods as required for additional customization
}
