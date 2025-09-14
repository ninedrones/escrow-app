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
  private baseUrl = '/api/coinmarketcap'; // Next.js APIルート経由

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
    convert: ('USD' | 'JPY')[] = ['USD', 'JPY']
  ): Promise<CoinMarketCapResponse> {
    // 複数の通貨を個別に取得（APIプランの制限により）
    const results: CoinMarketCapResponse[] = [];
    
    for (const symbol of symbols) {
      for (const currency of convert) {
        const url = `${this.baseUrl}?symbol=${symbol}&convert=${currency}`;
        
        const response = await fetch(url, {
          headers: {
            'Accept': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`CoinMarketCap API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        results.push(data);
      }
    }

    // 結果をマージ
    const mergedData: Record<string, CoinMarketCapData> = {};
    
    for (const result of results) {
      for (const [key, value] of Object.entries(result.data)) {
        if (!mergedData[key]) {
          mergedData[key] = value;
        } else {
          // 既存のデータに新しい通貨の情報を追加
          mergedData[key].quote = {
            ...mergedData[key].quote,
            ...value.quote,
          };
        }
      }
    }

    return {
      data: mergedData,
      status: results[0]?.status || {
        timestamp: new Date().toISOString(),
        error_code: 0,
        error_message: null,
        elapsed: 0,
        credit_count: 0,
      },
    };
  }

  /**
   * Get price for a specific cryptocurrency
   * @param symbol Cryptocurrency symbol (e.g., 'BTC', 'ETH')
   * @param convert Fiat currency to convert to (e.g., 'USD', 'JPY')
   */
  async getPrice(symbol: string, convert: 'USD' | 'JPY' = 'USD'): Promise<number> {
    const url = `${this.baseUrl}?symbol=${symbol}&convert=${convert}`;
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`CoinMarketCap API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const symbolData = data.data[symbol];
    
    if (!symbolData || !symbolData.quote[convert]) {
      throw new Error(`Price not found for ${symbol} in ${convert}`);
    }

    return symbolData.quote[convert].price;
  }

  /**
   * Get multiple prices at once
   * @param symbols Array of cryptocurrency symbols
   * @param convert Fiat currency to convert to
   */
  async getPrices(symbols: string[], convert: 'USD' | 'JPY' = 'USD'): Promise<Record<string, number>> {
    const prices: Record<string, number> = {};

    // 各シンボルを個別に取得
    for (const symbol of symbols) {
      try {
        const price = await this.getPrice(symbol, convert);
        prices[symbol] = price;
      } catch (error) {
        console.error(`Failed to get price for ${symbol}:`, error);
        // エラーが発生したシンボルはスキップ
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
