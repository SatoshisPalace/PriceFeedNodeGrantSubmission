import { COIN_GECKO_PRICE_URL } from "./constants";

//src/coin-gecko.ts
export async function getPriceFromCoinGecko(coinId: string): Promise<number> {
    const url = getCoinGeckoPriceURL(coinId);
    const response = await fetch(url);
    const data = await response.json();
    return data[coinId].usd as number;
}

export function getCoinGeckoPriceURL(coinId: string): string {
    return `${COIN_GECKO_PRICE_URL}?vs_currencies=usd&ids=${coinId}`;
}
