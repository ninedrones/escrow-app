import { NextRequest, NextResponse } from 'next/server';

const CMC_API_KEY = process.env.NEXT_PUBLIC_COINMARKETCAP_API_KEY;
const CMC_BASE_URL = 'https://pro-api.coinmarketcap.com/v1';

export async function GET(request: NextRequest) {
  try {
    if (!CMC_API_KEY) {
      return NextResponse.json(
        { error: 'CoinMarketCap API key not configured' },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol');
    const convert = searchParams.get('convert');

    if (!symbol || !convert) {
      return NextResponse.json(
        { error: 'Missing required parameters: symbol and convert' },
        { status: 400 }
      );
    }

    // CoinMarketCap APIにリクエストを送信
    const cmcUrl = new URL(`${CMC_BASE_URL}/cryptocurrency/quotes/latest`);
    cmcUrl.searchParams.append('symbol', symbol);
    cmcUrl.searchParams.append('convert', convert);

    const response = await fetch(cmcUrl.toString(), {
      headers: {
        'X-CMC_PRO_API_KEY': CMC_API_KEY,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('CoinMarketCap API error:', response.status, errorText);
      return NextResponse.json(
        { error: `CoinMarketCap API error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('API proxy error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
