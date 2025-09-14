'use client';

interface EscrowData {
  id: number;
  maker: string;
  taker: string;
  asset: string;
  amount: string;
  jpyAmount: number;
  deadline: number;
  isReleased: boolean;
  isRefunded: boolean;
  createdAt: number;
}

interface EscrowStatusDisplayProps {
  escrow: EscrowData;
  currentAddress?: string;
}

export function EscrowStatusDisplay({ escrow, currentAddress }: EscrowStatusDisplayProps) {
  const isMaker = currentAddress?.toLowerCase() === escrow.maker.toLowerCase();
  const isTaker = currentAddress?.toLowerCase() === escrow.taker.toLowerCase();
  
  const getStatusInfo = () => {
    if (escrow.isReleased) {
      return {
        status: 'Released',
        label: '完了',
        color: 'bg-green-100 text-green-800',
        icon: '✓',
        description: '暗号通貨が正常に送信されました'
      };
    }
    
    if (escrow.isRefunded) {
      return {
        status: 'Refunded',
        label: '返金済み',
        color: 'bg-yellow-100 text-yellow-800',
        icon: '↩',
        description: '期限切れにより返金されました'
      };
    }
    
    return {
      status: 'Active',
      label: '進行中',
      color: 'bg-blue-100 text-blue-800',
      icon: '⏳',
      description: '取引が進行中です'
    };
  };

  const statusInfo = getStatusInfo();
  const deadlineDate = new Date(escrow.deadline * 1000);
  const createdDate = new Date(escrow.createdAt * 1000);

  const getAssetInfo = (asset: string) => {
    switch (asset) {
      case '0x0000000000000000000000000000000000000000':
        return { name: 'Ethereum', symbol: 'ETH', icon: 'Ξ', color: 'bg-blue-100 text-blue-600' };
      default:
        return { name: 'Token', symbol: asset, icon: '$', color: 'bg-gray-100 text-gray-600' };
    }
  };

  const assetInfo = getAssetInfo(escrow.asset);

  return (
    <div className="space-y-6">
      {/* ステータス表示 */}
      <div className="text-center">
        <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${statusInfo.color}`}>
          <span className="mr-2">{statusInfo.icon}</span>
          {statusInfo.label}
        </div>
        <p className="mt-2 text-sm text-gray-600">{statusInfo.description}</p>
      </div>

      {/* 取引詳細 */}
      <div className="bg-white rounded-lg border p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">取引詳細</h3>
        
        <div className="grid grid-cols-1 gap-4">
          {/* アセット情報 */}
          <div className="flex items-center justify-between">
            <span className="text-gray-600">アセット:</span>
            <div className="flex items-center space-x-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${assetInfo.color}`}>
                <span className="font-bold">{assetInfo.icon}</span>
              </div>
              <span className="font-semibold">{assetInfo.name}</span>
            </div>
          </div>

          {/* 金額情報 */}
          <div className="flex items-center justify-between">
            <span className="text-gray-600">暗号通貨量:</span>
            <span className="font-semibold">{escrow.amount} {assetInfo.symbol}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-600">JPY金額:</span>
            <span className="font-semibold">¥{escrow.jpyAmount.toLocaleString()}</span>
          </div>

          {/* 参加者情報 */}
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Maker:</span>
            <div className="flex items-center space-x-2">
              <span className="font-mono text-sm">{escrow.maker.slice(0, 6)}...{escrow.maker.slice(-4)}</span>
              {isMaker && <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">あなた</span>}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-600">Taker:</span>
            <div className="flex items-center space-x-2">
              <span className="font-mono text-sm">{escrow.taker.slice(0, 6)}...{escrow.taker.slice(-4)}</span>
              {isTaker && <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">あなた</span>}
            </div>
          </div>

          {/* 時間情報 */}
          <div className="flex items-center justify-between">
            <span className="text-gray-600">作成日時:</span>
            <span className="text-sm">{createdDate.toLocaleString()}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-600">期限:</span>
            <span className="text-sm">{deadlineDate.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* 権限表示 */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">あなたの権限</h4>
        <div className="space-y-1 text-sm">
          {isMaker && (
            <>
              <div className="flex items-center text-green-700">
                <span className="mr-2">✓</span>
                OTCコードを入力してRelease可能
              </div>
              <div className="flex items-center text-green-700">
                <span className="mr-2">✓</span>
                期限後はRefund可能
              </div>
            </>
          )}
          {isTaker && (
            <div className="flex items-center text-blue-700">
              <span className="mr-2">ℹ</span>
              暗号通貨の受取を待機中
            </div>
          )}
          {!isMaker && !isTaker && (
            <div className="flex items-center text-gray-500">
              <span className="mr-2">ℹ</span>
              この取引の参加者ではありません
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
