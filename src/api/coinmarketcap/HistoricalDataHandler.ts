import { logger } from "../../logger";
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
            logger.info('-'.repeat(75))
            logger.info('Successfully retrieved historical minute data from CoinMarketCap.')
            logger.info('-'.repeat(75))
            return data;
        } catch (error) {
            logger.error('Failed to retrieve historical minute data from CoinMarketCap:', error)
            throw error;
        }
    }
}
