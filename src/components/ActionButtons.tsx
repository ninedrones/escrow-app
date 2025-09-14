'use client';

interface ActionButtonsProps {
  isMaker: boolean;
  isReleased: boolean;
  isRefunded: boolean;
  isRefundAvailable: boolean;
  onRelease: () => void;
  onRefund: () => void;
  isLoading?: boolean;
}

export function ActionButtons({
  isMaker,
  isReleased,
  isRefunded,
  isRefundAvailable,
  onRelease,
  onRefund,
  isLoading = false
}: ActionButtonsProps) {
  if (!isMaker) {
    return (
      <div className="bg-gray-50 rounded-lg p-6 text-center">
        <div className="text-gray-500 mb-2">
          <svg className="mx-auto h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          アクション
        </h3>
        <p className="text-gray-600">
          この機能はMakerのみが使用できます
        </p>
      </div>
    );
  }

  if (isReleased) {
    return (
      <div className="bg-green-50 rounded-lg p-6 text-center">
        <div className="text-green-600 mb-2">
          <svg className="mx-auto h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-green-900 mb-2">
          完了
        </h3>
        <p className="text-green-700">
          暗号通貨が正常に送信されました
        </p>
      </div>
    );
  }

  if (isRefunded) {
    return (
      <div className="bg-yellow-50 rounded-lg p-6 text-center">
        <div className="text-yellow-600 mb-2">
          <svg className="mx-auto h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-yellow-900 mb-2">
          返金済み
        </h3>
        <p className="text-yellow-700">
          期限切れにより返金されました
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Releaseボタン */}
      <button
        onClick={onRelease}
        disabled={isLoading}
        className="w-full py-4 px-6 bg-green-600 text-white text-lg font-semibold rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? '処理中...' : 'Release実行'}
      </button>

      {/* Refundボタン */}
      <button
        onClick={onRefund}
        disabled={!isRefundAvailable || isLoading}
        className={`w-full py-4 px-6 text-lg font-semibold rounded-lg transition-colors ${
          isRefundAvailable
            ? 'bg-yellow-600 text-white hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        {isRefundAvailable ? 'Refund実行' : '期限後にRefund可能'}
      </button>

      {/* 説明 */}
      <div className="text-sm text-gray-600 space-y-1">
        <p>• <strong>Release:</strong> OTCコードを入力して暗号通貨を送信</p>
        <p>• <strong>Refund:</strong> 期限後、暗号通貨を自分に返金</p>
      </div>
    </div>
  );
}
