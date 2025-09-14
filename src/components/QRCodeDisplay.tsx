'use client';

import { useState } from 'react';
import QRCode from 'react-qr-code';

interface QRCodeDisplayProps {
  escrowId: number;
  shareUrl: string;
  className?: string;
}

export function QRCodeDisplay({ escrowId, shareUrl, className = '' }: QRCodeDisplayProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      // トースト通知などで成功を表示
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  };

  return (
    <div className={`bg-white rounded-lg border p-6 ${className}`}>
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          QRコードで共有
        </h3>
        
        {/* QRコード */}
        <div className="inline-block p-4 bg-white border rounded-lg">
          <QRCode
            value={shareUrl}
            size={isExpanded ? 256 : 128}
            style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
          />
        </div>

        {/* 展開/縮小ボタン */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-2 text-sm text-blue-600 hover:text-blue-800"
        >
          {isExpanded ? '縮小' : '拡大'}
        </button>

        {/* 共有URL */}
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-2">共有URL:</p>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={shareUrl}
              readOnly
              className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md bg-gray-50"
            />
            <button
              onClick={copyToClipboard}
              className="px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              コピー
            </button>
          </div>
        </div>

        {/* 説明 */}
        <div className="mt-4 text-xs text-gray-500">
          <p>• QRコードをスキャンしてEscrowに参加</p>
          <p>• またはURLを直接共有</p>
          <p>• Escrow ID: #{escrowId}</p>
        </div>
      </div>
    </div>
  );
}
