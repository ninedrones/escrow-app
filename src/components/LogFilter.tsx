'use client';

interface LogFilterProps {
  filters: {
    type: string;
    asset: string;
    timeRange: string;
  };
  onFilterChange: (filters: { type: string; asset: string; timeRange: string }) => void;
}

export function LogFilter({ filters, onFilterChange }: LogFilterProps) {
  const handleFilterChange = (key: string, value: string) => {
    onFilterChange({
      ...filters,
      [key]: value
    });
  };

  return (
    <div className="bg-white rounded-lg border p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">フィルター</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* イベントタイプ */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            イベントタイプ
          </label>
          <select
            value={filters.type}
            onChange={(e) => handleFilterChange('type', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">すべて</option>
            <option value="EscrowCreated">作成</option>
            <option value="EscrowReleased">完了</option>
            <option value="EscrowRefunded">返金</option>
          </select>
        </div>

        {/* アセット */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            アセット
          </label>
          <select
            value={filters.asset}
            onChange={(e) => handleFilterChange('asset', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">すべて</option>
            <option value="0x0000000000000000000000000000000000000000">Ethereum (ETH)</option>
            <option value="USDC">USDC</option>
            <option value="USDT">USDT</option>
          </select>
        </div>

        {/* 時間範囲 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            時間範囲
          </label>
          <select
            value={filters.timeRange}
            onChange={(e) => handleFilterChange('timeRange', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">すべて</option>
            <option value="1h">過去1時間</option>
            <option value="24h">過去24時間</option>
            <option value="7d">過去7日間</option>
            <option value="30d">過去30日間</option>
          </select>
        </div>
      </div>

      {/* クリアボタン */}
      <div className="mt-4 flex justify-end">
        <button
          onClick={() => onFilterChange({ type: '', asset: '', timeRange: '' })}
          className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          フィルターをクリア
        </button>
      </div>
    </div>
  );
}
