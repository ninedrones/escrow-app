'use client';

import { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';

interface OTCCodeGeneratorProps {
  onCodeGenerated: (code: string) => void;
  disabled?: boolean;
}

export function OTCCodeGenerator({ onCodeGenerated, disabled }: OTCCodeGeneratorProps) {
  const [otcCode, setOtcCode] = useState<string>('');
  const [isGenerated, setIsGenerated] = useState(false);

  const generateOTCCode = () => {
    if (disabled) return;

    // 8文字のランダムなOTCコードを生成
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    setOtcCode(result);
    setIsGenerated(true);
    onCodeGenerated(result);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(otcCode);
      // トースト通知などで成功を表示
    } catch (err) {
      console.error('Failed to copy OTC code:', err);
    }
  };

  const resetCode = () => {
    setOtcCode('');
    setIsGenerated(false);
    onCodeGenerated('');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700">OTCコード</h3>
        {!isGenerated && (
          <button
            onClick={generateOTCCode}
            disabled={disabled}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            生成
          </button>
        )}
      </div>

      {!isGenerated ? (
        <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <p className="mt-2 text-sm text-gray-500">
            ボタンを押してOTCコードを生成してください
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* OTCコード表示 */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-mono font-bold text-gray-900 mb-2">
                {otcCode}
              </div>
              <button
                onClick={copyToClipboard}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                クリップボードにコピー
              </button>
            </div>
          </div>

          {/* QRコード表示 */}
          <div className="p-4 border rounded-lg">
            <div className="text-center">
              <div className="inline-block p-2 bg-white rounded">
                <QRCode
                  value={otcCode}
                  size={128}
                  style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
                />
              </div>
              <p className="mt-2 text-xs text-gray-500">
                QRコードをスキャンしてOTCコードを共有
              </p>
            </div>
          </div>

          {/* リセットボタン */}
          <button
            onClick={resetCode}
            className="w-full px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
          >
            新しいコードを生成
          </button>
        </div>
      )}

      <div className="text-xs text-gray-500">
        <p>• OTCコードは現金交換の際に使用します</p>
        <p>• このコードを相手に安全に共有してください</p>
        <p>• コードは一度だけ使用できます</p>
      </div>
    </div>
  );
}
