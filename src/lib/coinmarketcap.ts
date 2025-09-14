/**
 * CoinMarketCap API integration for price fetching
 * Documentation: https://coinmarketcap.com/api/documentation/v1/#section/Endpoint-Overview
 */

export interface CoinMarketCapQuote {
  price: number;
  volume_24h: number;
  percent_change_1h: number;
  percent_change_24h: number;
  percent_change_7d: number;
  market_cap: number;
  last_updated: string;
}

export interface CoinMarketCapData {
  id: number;
  name: string;
  symbol: string;
  slug: string;
  quote: {
    USD: CoinMarketCapQuote;
    JPY: CoinMarketCapQuote;
  };
}

export interface CoinMarketCapResponse {
  data: Record<string, CoinMarketCapData>;
  status: {
    timestamp: string;
    error_code: number;
    error_message: string | null;
    elapsed: number;
    credit_count: number;
  };
}

export class CoinMarketCapAPI {
  private apiKey: string;
  private baseUrl = 'https://pro-api.coinmarketcap.com/v1';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Get latest quotes for cryptocurrencies
   * @param symbols Array of cryptocurrency symbols (e.g., ['BTC', 'ETH', 'USDC', 'USDT'])
   * @param convert Array of fiat currencies to convert to (e.g., ['USD', 'JPY'])
   */
  async getLatestQuotes(
    symbols: string[],
    convert: string[] = ['USD', 'JPY']
  ): Promise<CoinMarketCapResponse> {
    const url = `${this.baseUrl}/cryptocurrency/quotes/latest`;
    const params = new URLSearchParams({
      symbol: symbols.join(','),
      convert: convert.join(','),
    });

    const response = await fetch(`${url}?${params}`, {
      headers: {
        'X-CMC_PRO_API_KEY': this.apiKey,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`CoinMarketCap API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get price for a specific cryptocurrency
   * @param symbol Cryptocurrency symbol (e.g., 'BTC', 'ETH')
   * @param convert Fiat currency to convert to (e.g., 'USD', 'JPY')
   */
  async getPrice(symbol: string, convert: string = 'USD'): Promise<number> {
    const response = await this.getLatestQuotes([symbol], [convert]);
    const data = response.data[symbol];
    
    if (!data || !data.quote[convert]) {
      throw new Error(`Price not found for ${symbol} in ${convert}`);
    }

    return data.quote[convert].price;
  }

  /**
   * Get multiple prices at once
   * @param symbols Array of cryptocurrency symbols
   * @param convert Fiat currency to convert to
   */
  async getPrices(symbols: string[], convert: string = 'USD'): Promise<Record<string, number>> {
    const response = await this.getLatestQuotes(symbols, [convert]);
    const prices: Record<string, number> = {};

    for (const symbol of symbols) {
      const data = response.data[symbol];
      if (data && data.quote[convert]) {
        prices[symbol] = data.quote[convert].price;
      }
    }

    return prices;
  }

  /**
   * Calculate required asset amount based on JPY amount
   * @param jpyAmount JPY amount
   * @param assetSymbol Asset symbol (ETH, USDC, USDT)
   * @param ethUsdPrice ETH/USD price
   * @param usdJpyPrice USD/JPY price
   */
  calculateAssetAmount(
    jpyAmount: number,
    assetSymbol: string,
    ethUsdPrice: number,
    usdJpyPrice: number
  ): number {
    // Convert JPY to USD
    const usdAmount = jpyAmount / usdJpyPrice;

    if (assetSymbol === 'ETH') {
      // Calculate ETH amount (18 decimals)
      return (usdAmount / ethUsdPrice) * 1e18;
    } else if (assetSymbol === 'USDC' || assetSymbol === 'USDT') {
      // Calculate USDC/USDT amount (6 decimals)
      return usdAmount * 1e6;
    }

    throw new Error(`Unsupported asset: ${assetSymbol}`);
  }

  /**
   * Calculate USD equivalent of asset amount
   * @param assetAmount Asset amount
   * @param assetSymbol Asset symbol (ETH, USDC, USDT)
   * @param ethUsdPrice ETH/USD price
   */
  calculateUSDEquivalent(
    assetAmount: number,
    assetSymbol: string,
    ethUsdPrice: number
  ): number {
    if (assetSymbol === 'ETH') {
      return (assetAmount * ethUsdPrice) / 1e18;
    } else if (assetSymbol === 'USDC' || assetSymbol === 'USDT') {
      return assetAmount / 1e6;
    }

    throw new Error(`Unsupported asset: ${assetSymbol}`);
  }
}

// Singleton instance
let cmcAPI: CoinMarketCapAPI | null = null;

export function getCoinMarketCapAPI(): CoinMarketCapAPI {
  if (!cmcAPI) {
    const apiKey = process.env.NEXT_PUBLIC_COINMARKETCAP_API_KEY;
    if (!apiKey) {
      throw new Error('CoinMarketCap API key not found. Please set NEXT_PUBLIC_COINMARKETCAP_API_KEY environment variable.');
    }
    cmcAPI = new CoinMarketCapAPI(apiKey);
  }
  return cmcAPI;
}
