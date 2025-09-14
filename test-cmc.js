// CoinMarketCap API テストスクリプト
import fetch from 'node-fetch';
import dotenv from 'dotenv';

async function testCoinMarketCapAPI() {
  console.log('🔍 CoinMarketCap API テストを開始します...\n');
  
  // 環境変数を確認
  const apiKey = process.env.NEXT_PUBLIC_COINMARKETCAP_API_KEY;
  
  if (!apiKey) {
    console.error('❌ エラー: NEXT_PUBLIC_COINMARKETCAP_API_KEY が設定されていません');
    console.log('📝 .env.local ファイルに以下を追加してください:');
    console.log('NEXT_PUBLIC_COINMARKETCAP_API_KEY=your_api_key_here');
    return;
  }
  
  console.log('✅ API キーが設定されています');
  console.log(`🔑 API キー: ${apiKey.substring(0, 8)}...`);
  
  try {
    // ETH価格を取得
    console.log('\n📊 ETH価格を取得中...');
    const ethResponse = await fetch('https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=ETH&convert=USD,JPY', {
      headers: {
        'X-CMC_PRO_API_KEY': apiKey,
        'Accept': 'application/json',
      },
    });
    
    if (!ethResponse.ok) {
      throw new Error(`HTTP ${ethResponse.status}: ${ethResponse.statusText}`);
    }
    
    const ethData = await ethResponse.json();
    console.log('✅ ETH価格取得成功');
    console.log(`💰 ETH/USD: $${ethData.data.ETH.quote.USD.price.toFixed(2)}`);
    console.log(`💰 ETH/JPY: ¥${ethData.data.ETH.quote.JPY.price.toFixed(2)}`);
    
    // USDC価格を取得
    console.log('\n📊 USDC価格を取得中...');
    const usdcResponse = await fetch('https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=USDC&convert=USD,JPY', {
      headers: {
        'X-CMC_PRO_API_KEY': apiKey,
        'Accept': 'application/json',
      },
    });
    
    if (!usdcResponse.ok) {
      throw new Error(`HTTP ${usdcResponse.status}: ${usdcResponse.statusText}`);
    }
    
    const usdcData = await usdcResponse.json();
    console.log('✅ USDC価格取得成功');
    console.log(`💰 USDC/USD: $${usdcData.data.USDC.quote.USD.price.toFixed(6)}`);
    console.log(`💰 USDC/JPY: ¥${usdcData.data.USDC.quote.JPY.price.toFixed(6)}`);
    
    // USDT価格を取得
    console.log('\n📊 USDT価格を取得中...');
    const usdtResponse = await fetch('https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=USDT&convert=USD,JPY', {
      headers: {
        'X-CMC_PRO_API_KEY': apiKey,
        'Accept': 'application/json',
      },
    });
    
    if (!usdtResponse.ok) {
      throw new Error(`HTTP ${usdtResponse.status}: ${usdtResponse.statusText}`);
    }
    
    const usdtData = await usdtResponse.json();
    console.log('✅ USDT価格取得成功');
    console.log(`💰 USDT/USD: $${usdtData.data.USDT.quote.USD.price.toFixed(6)}`);
    console.log(`💰 USDT/JPY: ¥${usdtData.data.USDT.quote.JPY.price.toFixed(6)}`);
    
    // 価格計算のテスト
    console.log('\n🧮 価格計算テスト...');
    const ethUsdPrice = ethData.data.ETH.quote.USD.price;
    const usdJpyPrice = usdcData.data.USDC.quote.JPY.price; // USDC/JPYをUSD/JPYの代理として使用
    
    console.log(`💱 USD/JPY レート: ${usdJpyPrice.toFixed(2)}`);
    
    // ¥10,000のETH計算
    const jpyAmount = 10000;
    const usdAmount = jpyAmount / usdJpyPrice;
    const ethAmount = (usdAmount / ethUsdPrice) * 1e18;
    
    console.log(`\n📈 計算例 (¥${jpyAmount.toLocaleString()}):`);
    console.log(`   USD換算: $${usdAmount.toFixed(2)}`);
    console.log(`   ETH必要量: ${(ethAmount / 1e18).toFixed(6)} ETH`);
    console.log(`   ETH必要量 (Wei): ${ethAmount.toFixed(0)}`);
    
    // USDC計算
    const usdcAmount = usdAmount * 1e6;
    console.log(`   USDC必要量: ${(usdcAmount / 1e6).toFixed(6)} USDC`);
    console.log(`   USDC必要量 (最小単位): ${usdcAmount.toFixed(0)}`);
    
    console.log('\n✅ すべてのテストが成功しました！');
    
  } catch (error) {
    console.error('❌ エラーが発生しました:', error.message);
    
    if (error.message.includes('401')) {
      console.log('💡 解決方法: API キーが無効です。CoinMarketCapで正しいAPIキーを取得してください。');
    } else if (error.message.includes('403')) {
      console.log('💡 解決方法: API キーの権限が不足しています。CoinMarketCapでAPIキーの権限を確認してください。');
    } else if (error.message.includes('429')) {
      console.log('💡 解決方法: API レート制限に達しました。しばらく待ってから再試行してください。');
    }
  }
}

// 環境変数を読み込み
dotenv.config({ path: '.env.local' });

testCoinMarketCapAPI();
