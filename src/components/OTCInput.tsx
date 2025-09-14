'use client';

import { useState } from 'react';

interface OTCInputProps {
  onRelease: (otcCode: string) => void;
  isMaker: boolean;
  disabled?: boolean;
  isLoading?: boolean;
}

export function OTCInput({ onRelease, isMaker, disabled, isLoading }: OTCInputProps) {
  const [otcCode, setOtcCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otcCode.trim()) {
      onRelease(otcCode.trim());
    }
  };

  if (!isMaker) {
    return (
      <div className="bg-gray-50 rounded-lg p-6 text-center">
        <div className="text-gray-500 mb-2">
          <svg className="mx-auto h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          OTCコード入力
        </h3>
        <p className="text-gray-600">
          この機能はMakerのみが使用できます
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        OTCコードでRelease
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="otc-code" className="block text-sm font-medium text-gray-700 mb-2">
            OTCコード
          </label>
          <input
            id="otc-code"
            type="text"
            value={otcCode}
            onChange={(e) => setOtcCode(e.target.value.toUpperCase())}
            disabled={disabled || isLoading}
            placeholder="例: ABC12345"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 font-mono"
            maxLength={8}
          />
          <p className="mt-1 text-xs text-gray-500">
            現金交換時に受け取ったOTCコードを入力してください
          </p>
        </div>

        <button
          type="submit"
          disabled={!otcCode.trim() || disabled || isLoading}
          className="w-full py-3 px-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? '処理中...' : 'Release実行'}
        </button>
      </form>

      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex">
          <svg className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.725-1.36 3.49 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <div className="text-sm text-yellow-800">
            <p className="font-medium">注意:</p>
            <p>• OTCコードは現金交換が完了した後にのみ入力してください</p>
            <p>• 一度実行すると取り消しできません</p>
          </div>
        </div>
      </div>
    </div>
  );
}
