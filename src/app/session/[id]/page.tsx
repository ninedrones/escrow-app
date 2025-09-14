'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import { toast } from 'react-hot-toast';
import { EscrowStatusDisplay } from '@/components/EscrowStatusDisplay';
import { CountdownTimer } from '@/components/CountdownTimer';
import { QRCodeDisplay } from '@/components/QRCodeDisplay';
import { OTCInput } from '@/components/OTCInput';
import { ActionButtons } from '@/components/ActionButtons';

// デモ用のEscrowデータ（実際の実装ではコントラクトから取得）
const DEMO_ESCROW_DATA = {
  id: 1,
  maker: '0x1234567890123456789012345678901234567890',
  taker: '0x0987654321098765432109876543210987654321',
  asset: '0x0000000000000000000000000000000000000000', // ETH
  amount: '0.014655',
  jpyAmount: 10000,
  deadline: Math.floor(Date.now() / 1000) + 30 * 60, // 30分後
  isReleased: false,
  isRefunded: false,
  createdAt: Math.floor(Date.now() / 1000) - 5 * 60, // 5分前
};

export default function SessionPage() {
  const params = useParams();
  const router = useRouter();
  const { address, isConnected } = useAccount();
  
  const [escrow, setEscrow] = useState(DEMO_ESCROW_DATA);
  const [isRefundAvailable, setIsRefundAvailable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const escrowId = params.id as string;
  const shareUrl = `${window.location.origin}/session/${escrowId}`;
  
  const isMaker = address?.toLowerCase() === escrow.maker.toLowerCase();
  const isTaker = address?.toLowerCase() === escrow.taker.toLowerCase();

  // 期限チェック
  useEffect(() => {
    const checkRefundAvailability = () => {
      const now = Math.floor(Date.now() / 1000);
      setIsRefundAvailable(now >= escrow.deadline);
    };

    checkRefundAvailability();
    const interval = setInterval(checkRefundAvailability, 1000);
    return () => clearInterval(interval);
  }, [escrow.deadline]);

  // ウォレット接続チェック
  useEffect(() => {
    if (!isConnected) {
      toast.error('ウォレットを接続してください');
      router.push('/');
    }
  }, [isConnected, router]);

  // Release実行
  const handleRelease = async (otcCode?: string) => {
    if (!isMaker) {
      toast.error('この操作はMakerのみが実行できます');
      return;
    }

    setIsLoading(true);
    try {
      // TODO: 実際のコントラクト呼び出しを実装
      // const txHash = await releaseEscrowContract(escrowId, otcCode);
      
      // デモ用のダミー処理
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setEscrow(prev => ({ ...prev, isReleased: true }));
      toast.success('暗号通貨が正常に送信されました！');
      
    } catch (error) {
      console.error('Release failed:', error);
      toast.error('Releaseの実行に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  // Refund実行
  const handleRefund = async () => {
    if (!isMaker) {
      toast.error('この操作はMakerのみが実行できます');
      return;
    }

    if (!isRefundAvailable) {
      toast.error('期限が来るまでRefundできません');
      return;
    }

    setIsLoading(true);
    try {
      // TODO: 実際のコントラクト呼び出しを実装
      // const txHash = await refundEscrowContract(escrowId);
      
      // デモ用のダミー処理
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setEscrow(prev => ({ ...prev, isRefunded: true }));
      toast.success('暗号通貨が返金されました！');
      
    } catch (error) {
      console.error('Refund failed:', error);
      toast.error('Refundの実行に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  // 期限切れ時の処理
  const handleExpired = () => {
    setIsRefundAvailable(true);
    toast('期限が切れました。Refundが可能になりました。', {
      icon: 'ℹ️',
      duration: 4000,
    });
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
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* ヘッダー */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Escrow #{escrowId}
              </h1>
              <p className="text-gray-600">
                {isMaker ? 'あなたが作成したEscrow' : '参加中のEscrow'}
              </p>
            </div>
            <button
              onClick={() => router.push('/')}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              ホームに戻る
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 左側: ステータスとカウントダウン */}
          <div className="space-y-6">
            {/* Escrow状態 */}
            <EscrowStatusDisplay 
              escrow={escrow} 
              currentAddress={address}
            />

            {/* カウントダウンタイマー */}
            {!escrow.isReleased && !escrow.isRefunded && (
              <div className="bg-white rounded-lg border p-6">
                <CountdownTimer
                  deadline={escrow.deadline}
                  onExpired={handleExpired}
                />
              </div>
            )}

            {/* OTCコード入力 */}
            <OTCInput
              onRelease={handleRelease}
              isMaker={isMaker}
              disabled={escrow.isReleased || escrow.isRefunded}
              isLoading={isLoading}
            />
          </div>

          {/* 右側: QRコードとアクション */}
          <div className="space-y-6">
            {/* QRコード表示 */}
            <QRCodeDisplay
              escrowId={parseInt(escrowId)}
              shareUrl={shareUrl}
            />

            {/* アクションボタン */}
            <div className="bg-white rounded-lg border p-6">
              <ActionButtons
                isMaker={isMaker}
                isReleased={escrow.isReleased}
                isRefunded={escrow.isRefunded}
                isRefundAvailable={isRefundAvailable}
                onRelease={() => handleRelease()}
                onRefund={handleRefund}
                isLoading={isLoading}
              />
            </div>
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
    </div>
  );
}
