// MarketChartRangeHandler.ts
import { BaseAPIHandler } from '../BaseAPIHandler';

// MarketChartRangeHandler.ts
import { CoinGeckoAPIHandler } from './CoinGeckoAPIHandler';

export class MarketChartRangeHandler extends CoinGeckoAPIHandler {
    constructor(coinId: string, vsCurrency: string) {
        super();
        this.setEndpoint(`/coins/${coinId}/market_chart/range`);
        this.setQueryParam('vs_currency', vsCurrency);
        // this.setQueryParam('interval', 'minutely'); // Ensure this is set if you need minutely data
    }

    public async getPriceAtTime(targetTime: number): Promise<{ time: Date; price: number }> {
        // Calculate a small range around the target time
        const fromTime = targetTime - 3600; // 1 hour before the target time
        const toTime = targetTime + 3600; // 1 hour after the target time

        // Set the time range query parameters
        this.setQueryParam('from', fromTime.toString());
        this.setQueryParam('to', toTime.toString());

        const data = await this.fetchData();
        console.log(data)
        const prices = data.prices as [number, number][];
        const closestPrice = this.findClosestPrice(prices, targetTime);
        return closestPrice;
    }

    private findClosestPrice(prices: [number, number][], targetTime: number): { time: Date; price: number } {
        const closest = prices.reduce((prev, curr) => (
            Math.abs(curr[0] - targetTime) < Math.abs(prev[0] - targetTime) ? curr : prev
        ));
        return { time: new Date(closest[0]), price: closest[1] };
    }
}