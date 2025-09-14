'use client';

import { useState, useEffect, useMemo } from 'react';
import { useAccount } from 'wagmi';
import { toast } from 'react-hot-toast';
import { LogEntry } from '@/components/LogEntry';
import { LogFilter } from '@/components/LogFilter';
import { LogStats } from '@/components/LogStats';

// デモ用のログデータ（実際の実装ではコントラクトイベントから取得）
const DEMO_LOGS = [
  {
    id: '1',
    timestamp: Math.floor(Date.now() / 1000) - 300, // 5分前
    type: 'EscrowCreated' as const,
    escrowId: 1,
    maker: '0x1234567890123456789012345678901234567890',
    taker: '0x0987654321098765432109876543210987654321',
    asset: '0x0000000000000000000000000000000000000000',
    amount: '0.014655',
    jpyAmount: 10000,
    txHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890'
  },
  {
    id: '2',
    timestamp: Math.floor(Date.now() / 1000) - 1800, // 30分前
    type: 'EscrowReleased' as const,
    escrowId: 2,
    maker: '0x1111111111111111111111111111111111111111',
    taker: '0x2222222222222222222222222222222222222222',
    asset: '0x0000000000000000000000000000000000000000',
    amount: '0.025000',
    jpyAmount: 15000,
    txHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'
  },
  {
    id: '3',
    timestamp: Math.floor(Date.now() / 1000) - 3600, // 1時間前
    type: 'EscrowRefunded' as const,
    escrowId: 3,
    maker: '0x3333333333333333333333333333333333333333',
    taker: '0x4444444444444444444444444444444444444444',
    asset: '0x0000000000000000000000000000000000000000',
    amount: '0.010000',
    jpyAmount: 5000,
    txHash: '0x9876543210fedcba9876543210fedcba9876543210fedcba9876543210fedcba'
  },
  {
    id: '4',
    timestamp: Math.floor(Date.now() / 1000) - 7200, // 2時間前
    type: 'EscrowCreated' as const,
    escrowId: 4,
    maker: '0x5555555555555555555555555555555555555555',
    taker: '0x6666666666666666666666666666666666666666',
    asset: '0x0000000000000000000000000000000000000000',
    amount: '0.030000',
    jpyAmount: 20000,
    txHash: '0xfedcba9876543210fedcba9876543210fedcba9876543210fedcba9876543210'
  },
  {
    id: '5',
    timestamp: Math.floor(Date.now() / 1000) - 10800, // 3時間前
    type: 'EscrowReleased' as const,
    escrowId: 5,
    maker: '0x7777777777777777777777777777777777777777',
    taker: '0x8888888888888888888888888888888888888888',
    asset: '0x0000000000000000000000000000000000000000',
    amount: '0.050000',
    jpyAmount: 30000,
    txHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890'
  }
];

export default function LogsPage() {
  const { address, isConnected } = useAccount();
  const [logs, setLogs] = useState(DEMO_LOGS);
  const [filters, setFilters] = useState({
    type: '',
    asset: '',
    timeRange: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  // フィルタリングされたログ
  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      // イベントタイプフィルター
      if (filters.type && log.type !== filters.type) {
        return false;
      }

      // アセットフィルター
      if (filters.asset) {
        if (filters.asset === '0x0000000000000000000000000000000000000000' && 
            log.asset !== '0x0000000000000000000000000000000000000000') {
          return false;
        }
        if (filters.asset !== '0x0000000000000000000000000000000000000000' && 
            log.asset === '0x0000000000000000000000000000000000000000') {
          return false;
        }
      }

      // 時間範囲フィルター
      if (filters.timeRange) {
        const now = Math.floor(Date.now() / 1000);
        const logTime = log.timestamp;
        const timeRanges = {
          '1h': 3600,
          '24h': 86400,
          '7d': 604800,
          '30d': 2592000
        };
        
        const timeLimit = timeRanges[filters.timeRange as keyof typeof timeRanges];
        if (timeLimit && (now - logTime) > timeLimit) {
          return false;
        }
      }

      return true;
    });
  }, [logs, filters]);

  // ログの読み込み（デモ用）
  const loadLogs = async () => {
    setIsLoading(true);
    try {
      // TODO: 実際のコントラクトイベントからログを取得
      // const events = await getEscrowEvents();
      // setLogs(events);
      
      // デモ用のダミー処理
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('ログを更新しました');
    } catch (error) {
      console.error('Failed to load logs:', error);
      toast.error('ログの読み込みに失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  // 自動更新（30秒ごと）
  useEffect(() => {
    const interval = setInterval(loadLogs, 30000);
    return () => clearInterval(interval);
  }, []);

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            ウォレット接続が必要です
          </h1>
          <p className="text-gray-600 mb-8">
            ログを表示するにはウォレットを接続してください
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* ヘッダー */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Escrowログ
              </h1>
              <p className="text-gray-600">
                すべてのEscrowイベントの履歴を表示します
              </p>
            </div>
            <button
              onClick={loadLogs}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? '更新中...' : '更新'}
            </button>
          </div>
        </div>

        {/* 統計情報 */}
        <LogStats logs={filteredLogs} />

        {/* フィルター */}
        <LogFilter
          filters={filters}
          onFilterChange={setFilters}
        />

        {/* ログ一覧 */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              ログ一覧 ({filteredLogs.length}件)
            </h2>
            <div className="text-sm text-gray-500">
              最新のイベントが上に表示されます
            </div>
          </div>

          {filteredLogs.length === 0 ? (
            <div className="bg-white rounded-lg border p-8 text-center">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                ログが見つかりません
              </h3>
              <p className="text-gray-600 mb-4">
                フィルター条件を変更するか、新しいEscrowを作成してください
              </p>
              <button
                onClick={() => setFilters({ type: '', asset: '', timeRange: '' })}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                フィルターをクリア
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredLogs.map((log) => (
                <LogEntry
                  key={log.id}
                  log={log}
                  currentAddress={address}
                />
              ))}
            </div>
          )}
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
