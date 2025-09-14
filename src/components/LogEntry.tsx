'use client';

interface LogEntryProps {
  log: {
    id: string;
    timestamp: number;
    type: 'EscrowCreated' | 'EscrowReleased' | 'EscrowRefunded';
    escrowId: number;
    maker: string;
    taker: string;
    asset: string;
    amount: string;
    jpyAmount?: number;
    txHash?: string;
  };
  currentAddress?: string;
}

export function LogEntry({ log, currentAddress }: LogEntryProps) {
  const getLogInfo = () => {
    switch (log.type) {
      case 'EscrowCreated':
        return {
          icon: '🆕',
          title: 'Escrow作成',
          color: 'bg-blue-100 text-blue-800',
          description: '新しいEscrowが作成されました'
        };
      case 'EscrowReleased':
        return {
          icon: '✅',
          title: 'Escrow完了',
          color: 'bg-green-100 text-green-800',
          description: '暗号通貨が正常に送信されました'
        };
      case 'EscrowRefunded':
        return {
          icon: '↩️',
          title: 'Escrow返金',
          color: 'bg-yellow-100 text-yellow-800',
          description: '期限切れにより返金されました'
        };
      default:
        return {
          icon: '📝',
          title: 'ログ',
          color: 'bg-gray-100 text-gray-800',
          description: 'イベントが発生しました'
        };
    }
  };

  const getAssetInfo = (asset: string) => {
    switch (asset) {
      case '0x0000000000000000000000000000000000000000':
        return { name: 'Ethereum', symbol: 'ETH', icon: 'Ξ' };
      default:
        return { name: 'Token', symbol: asset, icon: '$' };
    }
  };

  const logInfo = getLogInfo();
  const assetInfo = getAssetInfo(log.asset);
  const date = new Date(log.timestamp * 1000);
  const isMaker = currentAddress?.toLowerCase() === log.maker.toLowerCase();
  const isTaker = currentAddress?.toLowerCase() === log.taker.toLowerCase();

  return (
    <div className="bg-white rounded-lg border p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start space-x-4">
        {/* アイコン */}
        <div className="flex-shrink-0">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${logInfo.color}`}>
            {logInfo.icon}
          </div>
        </div>

        {/* メインコンテンツ */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900">
              {logInfo.title}
            </h3>
            <span className="text-sm text-gray-500">
              #{log.escrowId}
            </span>
          </div>

          <p className="text-gray-600 mb-3">
            {logInfo.description}
          </p>

          {/* 詳細情報 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-gray-500">アセット:</span>
              <div className="flex items-center space-x-2 mt-1">
                <span className="font-mono text-lg">{assetInfo.icon}</span>
                <span className="font-semibold">{assetInfo.name}</span>
                <span className="text-gray-500">({assetInfo.symbol})</span>
              </div>
            </div>

            <div>
              <span className="text-gray-500">金額:</span>
              <div className="mt-1">
                <div className="font-semibold">{log.amount} {assetInfo.symbol}</div>
                {log.jpyAmount && (
                  <div className="text-gray-600">¥{log.jpyAmount.toLocaleString()}</div>
                )}
              </div>
            </div>

            <div>
              <span className="text-gray-500">Maker:</span>
              <div className="mt-1">
                <span className="font-mono text-sm">
                  {log.maker.slice(0, 6)}...{log.maker.slice(-4)}
                </span>
                {isMaker && (
                  <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    あなた
                  </span>
                )}
              </div>
            </div>

            <div>
              <span className="text-gray-500">Taker:</span>
              <div className="mt-1">
                <span className="font-mono text-sm">
                  {log.taker.slice(0, 6)}...{log.taker.slice(-4)}
                </span>
                {isTaker && (
                  <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                    あなた
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* トランザクションハッシュ */}
          {log.txHash && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <span className="text-gray-500 text-sm">トランザクション:</span>
              <div className="mt-1">
                <a
                  href={`https://sepolia.etherscan.io/tx/${log.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-sm text-blue-600 hover:text-blue-800 break-all"
                >
                  {log.txHash.slice(0, 10)}...{log.txHash.slice(-8)}
                </a>
              </div>
            </div>
          )}

          {/* タイムスタンプ */}
          <div className="mt-3 pt-3 border-t border-gray-200">
            <span className="text-gray-500 text-sm">
              {date.toLocaleString('ja-JP', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
