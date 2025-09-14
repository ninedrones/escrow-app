'use client';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  jpyAmount: number;
  assetSymbol: 'ETH' | 'USDC' | 'USDT';
  assetAmount: string;
  usdEquivalent: number;
  otcCode: string;
  isLoading?: boolean;
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  jpyAmount,
  assetSymbol,
  assetAmount,
  usdEquivalent,
  otcCode,
  isLoading = false,
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* オーバーレイ */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />

        {/* モーダル */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Escrow作成の確認
                </h3>
                <div className="mt-4 space-y-4">
                  {/* 取引詳細 */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-3">取引詳細</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">JPY金額:</span>
                        <span className="font-semibold">¥{jpyAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">アセット:</span>
                        <span className="font-semibold">{assetSymbol}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">必要量:</span>
                        <span className="font-semibold">{assetAmount} {assetSymbol}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">USD換算:</span>
                        <span className="font-semibold">${usdEquivalent.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* OTCコード */}
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">OTCコード</h4>
                    <div className="text-center">
                      <div className="text-2xl font-mono font-bold text-blue-900">
                        {otcCode}
                      </div>
                      <p className="text-xs text-blue-700 mt-1">
                        このコードを現金交換時に使用します
                      </p>
                    </div>
                  </div>

                  {/* 注意事項 */}
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h4 className="font-medium text-yellow-900 mb-2">⚠️ 重要な注意事項</h4>
                    <ul className="text-xs text-yellow-800 space-y-1">
                      <li>• この取引はデモ目的のみです</li>
                      <li>• 実際の金融取引には使用しないでください</li>
                      <li>• OTCコードは安全に保管してください</li>
                      <li>• デフォルトで30分後にRefund可能になります</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* ボタン */}
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? '作成中...' : 'Escrowを作成'}
            </button>
            <button
              onClick={onClose}
              disabled={isLoading}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
            >
              キャンセル
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
