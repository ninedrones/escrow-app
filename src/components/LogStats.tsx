'use client';

interface LogStatsProps {
  logs: Array<{
    type: 'EscrowCreated' | 'EscrowReleased' | 'EscrowRefunded';
    asset: string;
    amount: string;
    jpyAmount?: number;
  }>;
}

export function LogStats({ logs }: LogStatsProps) {
  const stats = logs.reduce((acc, log) => {
    // イベントタイプ別カウント
    acc.events[log.type] = (acc.events[log.type] || 0) + 1;
    
    // アセット別カウント
    const assetName = log.asset === '0x0000000000000000000000000000000000000000' ? 'ETH' : 'Token';
    acc.assets[assetName] = (acc.assets[assetName] || 0) + 1;
    
    // 総JPY金額
    if (log.jpyAmount) {
      acc.totalJPY += log.jpyAmount;
    }
    
    return acc;
  }, {
    events: {} as Record<string, number>,
    assets: {} as Record<string, number>,
    totalJPY: 0
  });

  const getAssetInfo = (asset: string) => {
    switch (asset) {
      case '0x0000000000000000000000000000000000000000':
        return { name: 'Ethereum', symbol: 'ETH', icon: 'Ξ', color: 'bg-blue-100 text-blue-600' };
      default:
        return { name: 'Token', symbol: asset, icon: '$', color: 'bg-gray-100 text-gray-600' };
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {/* 総イベント数 */}
      <div className="bg-white rounded-lg border p-4">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
            <span className="text-blue-600 font-bold">📊</span>
          </div>
          <div>
            <p className="text-sm text-gray-600">総イベント数</p>
            <p className="text-2xl font-bold text-gray-900">
              {logs.length}
            </p>
          </div>
        </div>
      </div>

      {/* 総JPY金額 */}
      <div className="bg-white rounded-lg border p-4">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
            <span className="text-green-600 font-bold">¥</span>
          </div>
          <div>
            <p className="text-sm text-gray-600">総JPY金額</p>
            <p className="text-2xl font-bold text-gray-900">
              ¥{stats.totalJPY.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* 完了率 */}
      <div className="bg-white rounded-lg border p-4">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
            <span className="text-purple-600 font-bold">%</span>
          </div>
          <div>
            <p className="text-sm text-gray-600">完了率</p>
            <p className="text-2xl font-bold text-gray-900">
              {logs.length > 0 
                ? Math.round((stats.events.EscrowReleased || 0) / logs.length * 100)
                : 0
              }%
            </p>
          </div>
        </div>
      </div>

      {/* イベントタイプ別詳細 */}
      <div className="md:col-span-3 bg-white rounded-lg border p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">イベントタイプ別</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center">
              <span className="text-2xl mr-3">🆕</span>
              <span className="font-medium text-gray-900">作成</span>
            </div>
            <span className="text-2xl font-bold text-blue-600">
              {stats.events.EscrowCreated || 0}
            </span>
          </div>

          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div className="flex items-center">
              <span className="text-2xl mr-3">✅</span>
              <span className="font-medium text-gray-900">完了</span>
            </div>
            <span className="text-2xl font-bold text-green-600">
              {stats.events.EscrowReleased || 0}
            </span>
          </div>

          <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
            <div className="flex items-center">
              <span className="text-2xl mr-3">↩️</span>
              <span className="font-medium text-gray-900">返金</span>
            </div>
            <span className="text-2xl font-bold text-yellow-600">
              {stats.events.EscrowRefunded || 0}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
