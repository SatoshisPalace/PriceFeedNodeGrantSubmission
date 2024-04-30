import { BaseAPIHandler } from "../BaseAPIHandler";
import { COIN_GECKO_BASE_URL } from "./constants";

export class CoinGeckoAPIHandler extends BaseAPIHandler {

    constructor() {
        super(COIN_GECKO_BASE_URL);
    }

    public setCurrency(currency: string): this {
        this.setQueryParam('vs_currencies', currency);
        return this;
    }

    public setCoinId(coinId: string): this {
        this.setQueryParam('ids', coinId);
        return this;
    }
}