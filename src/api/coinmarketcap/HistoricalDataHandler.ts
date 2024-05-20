import { CoinMarketCapAPIHandler } from "./CoinMarketCapAPIHandler";

export class HistoricalDataHandler extends CoinMarketCapAPIHandler {
    constructor(coinId: string, currency: string) {
        super();
        this.setEndpoint('v3/cryptocurrency/quotes/historical')
            .setCoinId(coinId)
            .setTargetCurrency(currency)
            .setInterval("5m")
    }

    public async getHistoricalMinuteData(limit: string, endTime: string): Promise<any> {
        this.setLimit(limit)
            .setEndTime(endTime)

        try {
            const data = await this.fetchData();
            console.log('Historical minute data retrieved successfully.');
            console.log(JSON.stringify(data))
            return data;
        } catch (error) {
            console.error('Failed to retrieve historical minute data:', error);
            throw error;
        }
    }
}
