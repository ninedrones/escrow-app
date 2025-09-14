import { useState, useEffect, useCallback } from 'react';
import { getCoinMarketCapAPI } from '@/lib/coinmarketcap';

export interface PriceData {
  ethUsdPrice: number;
  usdJpyPrice: number;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

export interface AssetCalculation {
  assetAmount: number;
  usdEquivalent: number;
  isValid: boolean;
  error?: string;
}

export function usePriceCalculation() {
  const [priceData, setPriceData] = useState<PriceData>({
    ethUsdPrice: 0,
    usdJpyPrice: 0,
    loading: true,
    error: null,
    lastUpdated: null,
  });

  // レート制限のための状態
  const [lastFetchTime, setLastFetchTime] = useState<number>(0);
  const [isRateLimited, setIsRateLimited] = useState<boolean>(false);

  const fetchPrices = useCallback(async (force: boolean = false) => {
    const now = Date.now();
    const timeSinceLastFetch = now - lastFetchTime;
    
    // レート制限: 最低10秒間隔（1分間に6回以下）
    if (!force && timeSinceLastFetch < 10000) {
      console.log('Rate limited: Too soon to fetch prices');
      return;
    }

    // レート制限中の場合、強制でない限りスキップ
    if (isRateLimited && !force) {
      console.log('Rate limited: API limit reached');
      return;
    }

    try {
      setPriceData(prev => ({ ...prev, loading: true, error: null }));
      
      const cmcAPI = getCoinMarketCapAPI();
      const prices = await cmcAPI.getPrices(['ETH', 'USDC', 'USDT'], 'USD');
      const jpyPrice = await cmcAPI.getPrice('USDC', 'JPY'); // Use USDC as proxy for USD/JPY
      
      setPriceData({
        ethUsdPrice: prices.ETH || 0,
        usdJpyPrice: jpyPrice || 0,
        loading: false,
        error: null,
        lastUpdated: new Date(),
      });
      
      setLastFetchTime(now);
      setIsRateLimited(false);
    } catch (error) {
      console.error('Failed to fetch prices:', error);
      
      // 429エラーの場合はレート制限を有効にする
      if (error instanceof Error && error.message.includes('429')) {
        setIsRateLimited(true);
        setPriceData(prev => ({
          ...prev,
          loading: false,
          error: 'API rate limit reached. Please wait before retrying.',
        }));
        
        // 5分後にレート制限を解除
        setTimeout(() => {
          setIsRateLimited(false);
        }, 300000);
      } else {
        setPriceData(prev => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : 'Failed to fetch prices',
        }));
      }
    }
  }, [lastFetchTime, isRateLimited]);

  // 初回読み込み時のみ実行
  useEffect(() => {
    fetchPrices(true);
  }, []);

  // 2分ごとに価格を更新（レート制限を考慮）
  useEffect(() => {
    const interval = setInterval(() => {
      fetchPrices(false);
    }, 120000); // 2分間隔に変更
    
    return () => clearInterval(interval);
  }, [fetchPrices]);

  // ウィンドウフォーカス時の更新を無効化（レート制限のため）
  // useEffect(() => {
  //   const handleFocus = () => {
  //     fetchPrices(false);
  //   };
  //   
  //   window.addEventListener('focus', handleFocus);
  //   return () => window.removeEventListener('focus', handleFocus);
  // }, [fetchPrices]);

  const calculateAssetAmount = useCallback((
    jpyAmount: number,
    assetSymbol: 'ETH' | 'USDC' | 'USDT'
  ): AssetCalculation => {
    if (priceData.loading || priceData.error) {
      return {
        assetAmount: 0,
        usdEquivalent: 0,
        isValid: false,
        error: priceData.error || 'Loading prices...',
      };
    }

    if (jpyAmount < 1000 || jpyAmount % 1000 !== 0) {
      return {
        assetAmount: 0,
        usdEquivalent: 0,
        isValid: false,
        error: 'JPY amount must be at least ¥1,000 and a multiple of ¥1,000',
      };
    }

    try {
      const cmcAPI = getCoinMarketCapAPI();
      const assetAmount = cmcAPI.calculateAssetAmount(
        jpyAmount,
        assetSymbol,
        priceData.ethUsdPrice,
        priceData.usdJpyPrice
      );

      const usdEquivalent = cmcAPI.calculateUSDEquivalent(
        assetAmount,
        assetSymbol,
        priceData.ethUsdPrice
      );

      // Check USD cap ($5,000)
      if (usdEquivalent > 5000) {
        return {
          assetAmount,
          usdEquivalent,
          isValid: false,
          error: 'USD equivalent exceeds $5,000 limit',
        };
      }

      return {
        assetAmount,
        usdEquivalent,
        isValid: true,
      };
    } catch (error) {
      return {
        assetAmount: 0,
        usdEquivalent: 0,
        isValid: false,
        error: error instanceof Error ? error.message : 'Calculation failed',
      };
    }
  }, [priceData]);

  return {
    priceData,
    calculateAssetAmount,
    refetchPrices: fetchPrices,
  };
}
