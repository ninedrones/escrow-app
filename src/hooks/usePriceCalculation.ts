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

  const fetchPrices = useCallback(async () => {
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
    } catch (error) {
      console.error('Failed to fetch prices:', error);
      setPriceData(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch prices',
      }));
    }
  }, []);

  // Fetch prices on mount and every 60 seconds
  useEffect(() => {
    fetchPrices();
    const interval = setInterval(fetchPrices, 60000); // 60 seconds
    return () => clearInterval(interval);
  }, [fetchPrices]);

  // Fetch prices when window regains focus
  useEffect(() => {
    const handleFocus = () => {
      fetchPrices();
    };
    
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [fetchPrices]);

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
