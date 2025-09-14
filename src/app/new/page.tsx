'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { JPYAmountInput } from '@/components/JPYAmountInput';
import { AssetSelector } from '@/components/AssetSelector';
import { PriceDisplay } from '@/components/PriceDisplay';
import { OTCCodeGenerator } from '@/components/OTCCodeGenerator';
import { ConfirmationModal } from '@/components/ConfirmationModal';
import { usePriceCalculation } from '@/hooks/usePriceCalculation';

export default function NewEscrowPage() {
  const { isConnected, address } = useAccount();
  const router = useRouter();
  const { calculateAssetAmount } = usePriceCalculation();

  // フォーム状態
  const [jpyAmount, setJpyAmount] = useState(10000);
  const [assetSymbol, setAssetSymbol] = useState<'ETH' | 'USDC' | 'USDT'>('ETH');
  const [otcCode, setOtcCode] = useState('');
  const [hasPriceDrift, setHasPriceDrift] = useState(false);
  
  // モーダル状態
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // ウォレット接続チェック
  useEffect(() => {
    if (!isConnected) {
      toast.error('ウォレットを接続してください');
      router.push('/');
    }
  }, [isConnected, router]);

  // 価格計算
  const calculation = calculateAssetAmount(jpyAmount, assetSymbol);
  const assetAmount = calculation.isValid 
    ? (calculation.assetAmount / Math.pow(10, assetSymbol === 'ETH' ? 18 : 6)).toFixed(6)
    : '0.000000';

  // バリデーション
  const isFormValid = () => {
    return (
      isConnected &&
      jpyAmount >= 1000 &&
      jpyAmount % 1000 === 0 &&
      calculation.isValid &&
      !hasPriceDrift &&
      otcCode.length > 0
    );
  };

  // Escrow作成
  const handleCreateEscrow = async () => {
    if (!isFormValid()) {
      toast.error('フォームを正しく入力してください');
      return;
    }

    setIsCreating(true);
    try {
      // TODO: 実際のコントラクト呼び出しを実装
      // const txHash = await createEscrowContract({
      //   taker: address,
      //   asset: assetSymbol,
      //   jpyAmount,
      //   assetAmount: calculation.assetAmount,
      //   otcCode,
      // });

      // デモ用のダミー処理
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Escrowが正常に作成されました！');
      router.push(`/session/1`); // デモ用のID
      
    } catch (error) {
      console.error('Escrow creation failed:', error);
      toast.error('Escrowの作成に失敗しました');
    } finally {
      setIsCreating(false);
      setIsModalOpen(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            ウォレット接続が必要です
          </h1>
          <p className="text-gray-600 mb-8">
            このページを使用するにはウォレットを接続してください
          </p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            ホームに戻る
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* ヘッダー */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            新しいEscrowを作成
          </h1>
          <p className="text-gray-600">
            暗号通貨を預けて、現金での受け取りを待ちます
          </p>
        </div>

        {/* フォーム */}
        <div className="bg-white rounded-2xl shadow-xl p-6 space-y-6">
          {/* JPY金額入力 */}
          <JPYAmountInput
            value={jpyAmount}
            onChange={setJpyAmount}
            error={jpyAmount < 1000 || jpyAmount % 1000 !== 0 ? '¥1,000単位で入力してください' : undefined}
            disabled={isCreating}
          />

          {/* アセット選択 */}
          <AssetSelector
            value={assetSymbol}
            onChange={setAssetSymbol}
            disabled={isCreating}
          />

          {/* 価格表示 */}
          <PriceDisplay
            jpyAmount={jpyAmount}
            assetSymbol={assetSymbol}
            onPriceDrift={setHasPriceDrift}
          />

          {/* OTCコード生成 */}
          <OTCCodeGenerator
            onCodeGenerated={setOtcCode}
            disabled={isCreating}
          />

          {/* 作成ボタン */}
          <div className="pt-4">
            <button
              onClick={() => setIsModalOpen(true)}
              disabled={!isFormValid() || isCreating}
              className="w-full py-4 px-6 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isCreating ? '作成中...' : 'Escrowを作成'}
            </button>
            
            {!isFormValid() && (
              <p className="mt-2 text-sm text-red-600 text-center">
                {!isConnected && 'ウォレットを接続してください'}
                {isConnected && jpyAmount < 1000 && '¥1,000以上で入力してください'}
                {isConnected && jpyAmount >= 1000 && jpyAmount % 1000 !== 0 && '¥1,000単位で入力してください'}
                {isConnected && jpyAmount >= 1000 && jpyAmount % 1000 === 0 && !calculation.isValid && '価格データを取得中です'}
                {isConnected && jpyAmount >= 1000 && jpyAmount % 1000 === 0 && calculation.isValid && hasPriceDrift && '価格を更新してください'}
                {isConnected && jpyAmount >= 1000 && jpyAmount % 1000 === 0 && calculation.isValid && !hasPriceDrift && !otcCode && 'OTCコードを生成してください'}
              </p>
            )}
          </div>
        </div>

        {/* 注意事項 */}
        <div className="mt-8 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">
            ⚠️ デモ目的のみ
          </h3>
          <p className="text-yellow-700">
            このアプリケーションはハッカソンデモ用です。実際の金融取引には使用しないでください。
          </p>
        </div>
      </div>

      {/* 確認モーダル */}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleCreateEscrow}
        jpyAmount={jpyAmount}
        assetSymbol={assetSymbol}
        assetAmount={assetAmount}
        usdEquivalent={calculation.usdEquivalent}
        otcCode={otcCode}
        isLoading={isCreating}
      />
    </div>
  );
}
