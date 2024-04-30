import { COIN_GECKO_API_KEY } from './constants';
import { CoinGeckoAPIHandler } from './CoinGeckoAPIHandler';


export class HistoricalChartDataHandler extends CoinGeckoAPIHandler {
    constructor(coinId: string, vsCurrency: string) {
        super();
        this.setEndpoint(`/coins/${coinId}/market_chart`);
        this.setQueryParam('vs_currency', vsCurrency);
        this.setQueryParam('days', "1");  // 'days' can be '1', '14', '30', 'max' etc.
        this.setHeader('accept', 'application/json');
        this.setHeader('x-cg-demo-api-key', COIN_GECKO_API_KEY!);
    }

    public async getMarketChartData(): Promise<any> {
        try {
            const data = await this.fetchData();
            console.log('Market chart data retrieved successfully.');
            return data;
        } catch (error) {
            console.error('Failed to retrieve market chart data:', error);
            throw error;
        }
    }
}
