import { BaseAPIHandler } from "../BaseAPIHandler";
import { COIN_MARKET_CAP_BASE_URL, COIN_MARKET_CAP_API_KEY } from "./constants";

export class CoinMarketCapAPIHandler extends BaseAPIHandler {

    constructor() {
        super(COIN_MARKET_CAP_BASE_URL);
        this.setHeader('accept', 'application/json')
            .setHeader('X-CMC_PRO_API_KEY', `${COIN_MARKET_CAP_API_KEY}`)
    }

    public setTargetCurrency(currency: string): this {
        this.setQueryParam('convert', currency);
        return this;
    }

    public setCoinId(coinId: string): this {
        this.setQueryParam('id', coinId);
        return this;
    }

    public setLimit(limit: string): this {
        this.setQueryParam('count', limit);
        return this;
    }

    public setEndTime(unixTimeStamp: string): this {
        this.setQueryParam('time_end', unixTimeStamp);
        return this;
    }

    public setInterval(interval: string): this {
        this.setQueryParam('interval', interval);
        return this;
    }

    public getAuthHeader(): string {
        return `${COIN_MARKET_CAP_API_KEY}`
    }
}