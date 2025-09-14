'use client';

import { usePriceCalculation } from '@/hooks/usePriceCalculation';

interface PriceDisplayProps {
  jpyAmount: number;
  assetSymbol: 'ETH' | 'USDC' | 'USDT';
  onPriceDrift?: (hasDrift: boolean) => void;
}

export function PriceDisplay({ jpyAmount, assetSymbol, onPriceDrift }: PriceDisplayProps) {
  const { priceData, calculateAssetAmount, refetchPrices } = usePriceCalculation();
  const calculation = calculateAssetAmount(jpyAmount, assetSymbol);

  // 価格変動の検出（±1%以上）
  const hasPriceDrift = priceData.lastUpdated && 
    Date.now() - priceData.lastUpdated.getTime() > 60000; // 60秒以上経過

  if (onPriceDrift && hasPriceDrift !== null) {
    onPriceDrift(hasPriceDrift);
  }

  const formatPrice = (price: number) => {
    if (price === 0) return '0.00';
    if (price < 0.01) return price.toFixed(6);
    if (price < 1) return price.toFixed(4);
    return price.toFixed(2);
  };

  const formatAmount = (amount: number, decimals: number) => {
    return (amount / Math.pow(10, decimals)).toFixed(6);
  };

  const getAssetDecimals = (symbol: string) => {
    return symbol === 'ETH' ? 18 : 6; // USDC, USDTは6桁
  };

  return (
    <div className="space-y-4">
      {/* 価格データ表示 */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-700">現在の価格</h3>
          <button
            onClick={() => refetchPrices(true)}
            disabled={priceData.loading || priceData.error?.includes('rate limit')}
            className="text-xs text-blue-600 hover:text-blue-800 disabled:opacity-50"
          >
            {priceData.loading ? '更新中...' : 
             priceData.error?.includes('rate limit') ? '制限中' : '更新'}
          </button>
        </div>
        
        {priceData.loading ? (
          <div className="text-sm text-gray-500">価格を取得中...</div>
        ) : priceData.error ? (
          <div className="text-sm text-red-600">
            エラー: {priceData.error}
            {priceData.error.includes('rate limit') && (
              <div className="text-xs text-yellow-600 mt-1">
                ⏳ API制限中 - 5分後に自動再試行
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-gray-500">ETH/USD</div>
              <div className="font-semibold">${formatPrice(priceData.ethUsdPrice)}</div>
            </div>
            <div>
              <div className="text-gray-500">USD/JPY</div>
              <div className="font-semibold">¥{formatPrice(priceData.usdJpyPrice)}</div>
            </div>
            <div className="col-span-2">
              <div className="text-gray-500">最終更新</div>
              <div className="text-xs">
                {priceData.lastUpdated?.toLocaleString() || '不明'}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 価格変動警告 */}
      {hasPriceDrift && (
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-yellow-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.725-1.36 3.49 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span className="text-sm text-yellow-800">
              価格が古くなっています。更新ボタンを押して最新の価格を取得してください。
            </span>
          </div>
        </div>
      )}

      {/* 計算結果表示 */}
      {jpyAmount > 0 && (
        <div className="p-4 bg-blue-50 rounded-lg">
          <h3 className="text-sm font-medium text-blue-800 mb-3">必要量計算</h3>
          
          {calculation.isValid ? (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-blue-700">JPY金額:</span>
                <span className="font-semibold">¥{jpyAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-blue-700">USD換算:</span>
                <span className="font-semibold">${formatPrice(calculation.usdEquivalent)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-blue-700">必要{assetSymbol}量:</span>
                <span className="font-semibold">
                  {formatAmount(calculation.assetAmount, getAssetDecimals(assetSymbol))} {assetSymbol}
                </span>
              </div>
              <div className="text-xs text-blue-600 mt-2">
                最小単位: {calculation.assetAmount.toFixed(0)}
              </div>
            </div>
          ) : (
            <div className="text-sm text-red-600">
              {calculation.error || '計算できません'}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
