// SimplePriceHandler.ts
import { CoinGeckoAPIHandler } from './CoinGeckoAPIHandler';

export class SimplePriceHandler extends CoinGeckoAPIHandler {
    constructor(coinId: string, currency: string = 'usd') {
        super();
        this.setEndpoint('/simple/price');
        this.setCoinId(coinId);
        this.setCurrency(currency);
        this.setHeader('accept', 'application/json');
        this.setHeader('x-cg-demo-api-key', 'CG-45oiX6AHXgBbHmDhkteRu3rK');
    }
}