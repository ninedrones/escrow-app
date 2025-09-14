'use client';

import { usePriceCalculation } from '@/hooks/usePriceCalculation';
import { useState } from 'react';

export function PriceTest() {
  const { priceData, calculateAssetAmount, refetchPrices } = usePriceCalculation();
  const [jpyAmount, setJpyAmount] = useState(10000);

  const ethCalculation = calculateAssetAmount(jpyAmount, 'ETH');
  const usdcCalculation = calculateAssetAmount(jpyAmount, 'USDC');
  const usdtCalculation = calculateAssetAmount(jpyAmount, 'USDT');

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">価格計算テスト</h2>
      
      {/* 価格データ表示 */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-3 text-gray-800">現在の価格データ</h3>
        {priceData.loading ? (
          <p className="text-gray-600">価格を取得中...</p>
        ) : priceData.error ? (
          <p className="text-red-600">エラー: {priceData.error}</p>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">ETH/USD</p>
              <p className="text-lg font-semibold">${priceData.ethUsdPrice.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">USD/JPY</p>
              <p className="text-lg font-semibold">¥{priceData.usdJpyPrice.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">最終更新</p>
              <p className="text-sm">{priceData.lastUpdated?.toLocaleString()}</p>
            </div>
            <div className="flex items-center">
              <button
                onClick={refetchPrices}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                価格を更新
              </button>
            </div>
          </div>
        )}
      </div>

      {/* JPY金額入力 */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          JPY金額
        </label>
        <input
          type="number"
          value={jpyAmount}
          onChange={(e) => setJpyAmount(Number(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          min="1000"
          step="1000"
        />
        <p className="text-sm text-gray-500 mt-1">¥1,000単位で入力してください</p>
      </div>

      {/* 計算結果 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* ETH計算 */}
        <div className="p-4 border rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-2">ETH</h4>
          {ethCalculation.isValid ? (
            <div>
              <p className="text-sm text-gray-600">必要量</p>
              <p className="text-lg font-semibold">{(ethCalculation.assetAmount / 1e18).toFixed(6)} ETH</p>
              <p className="text-sm text-gray-600">USD換算</p>
              <p className="text-sm">${ethCalculation.usdEquivalent.toFixed(2)}</p>
            </div>
          ) : (
            <p className="text-red-600 text-sm">{ethCalculation.error}</p>
          )}
        </div>

        {/* USDC計算 */}
        <div className="p-4 border rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-2">USDC</h4>
          {usdcCalculation.isValid ? (
            <div>
              <p className="text-sm text-gray-600">必要量</p>
              <p className="text-lg font-semibold">{(usdcCalculation.assetAmount / 1e6).toFixed(6)} USDC</p>
              <p className="text-sm text-gray-600">USD換算</p>
              <p className="text-sm">${usdcCalculation.usdEquivalent.toFixed(2)}</p>
            </div>
          ) : (
            <p className="text-red-600 text-sm">{usdcCalculation.error}</p>
          )}
        </div>

        {/* USDT計算 */}
        <div className="p-4 border rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-2">USDT</h4>
          {usdtCalculation.isValid ? (
            <div>
              <p className="text-sm text-gray-600">必要量</p>
              <p className="text-lg font-semibold">{(usdtCalculation.assetAmount / 1e6).toFixed(6)} USDT</p>
              <p className="text-sm text-gray-600">USD換算</p>
              <p className="text-sm">${usdtCalculation.usdEquivalent.toFixed(2)}</p>
            </div>
          ) : (
            <p className="text-red-600 text-sm">{usdtCalculation.error}</p>
          )}
        </div>
      </div>

      {/* テスト用の計算例 */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-blue-800 mb-2">テスト用計算例</h4>
        <div className="text-sm text-blue-700">
          <p>¥10,000 → ETH: {(10000 / priceData.usdJpyPrice / priceData.ethUsdPrice).toFixed(6)} ETH</p>
          <p>¥10,000 → USDC: {(10000 / priceData.usdJpyPrice).toFixed(6)} USDC</p>
          <p>¥10,000 → USDT: {(10000 / priceData.usdJpyPrice).toFixed(6)} USDT</p>
        </div>
      </div>
    </div>
  );
}
