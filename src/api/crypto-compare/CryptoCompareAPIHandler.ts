import { BaseAPIHandler } from "../BaseAPIHandler";
import { CRYPTO_COMPARE_API_KEY, CRYPTO_COMPARE_BASE_URL } from "./constants";

export class CryptoCompateAPIHandler extends BaseAPIHandler {

    constructor() {
        super(CRYPTO_COMPARE_BASE_URL);
        this.setHeader('accept', 'application/json')
            .setHeader('authorization', `Apikey ${CRYPTO_COMPARE_API_KEY}`)
    }

    public setCurrency(currency: string): this {
        this.setQueryParam('tsym', currency);
        return this;
    }

    public setCoinId(coinId: string): this {
        this.setQueryParam('fsym', coinId);
        return this;
    }

    public setLimit(limit: string): this {
        this.setQueryParam('limit', limit);
        return this;
    }

    public setEndTime(unixTimeStamp: string): this {
        this.setQueryParam('toTs', unixTimeStamp);
        return this;
    }
}