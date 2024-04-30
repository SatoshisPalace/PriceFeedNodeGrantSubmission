import { BaseAPIHandler } from "../BaseAPIHandler";
import { CRYPTO_COMPARE_BASE_URL, CRYPTO_COMPARE_API_KEY } from "./constants";
import { CryptoCompateAPIHandler } from "./CryptoCompareAPIHandler";

export class CryptoCompareHistoricalDataHandler extends CryptoCompateAPIHandler {
    constructor(coinId: string, currency: string) {
        super();
        this.setEndpoint('/data/v2/histominute')
            .setCoinId(coinId)
            .setCurrency(currency)
    }

    public async getHistoricalMinuteData(limit: string, endTime: string): Promise<any> {
        this.setLimit(limit)
            .setEndTime(endTime)

        try {
            const data = await this.fetchData();
            console.log('Historical minute data retrieved successfully.');
            return data;
        } catch (error) {
            console.error('Failed to retrieve historical minute data:', error);
            throw error;
        }
    }
}
