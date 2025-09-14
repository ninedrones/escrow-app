'use client';

import { useState, useEffect } from 'react';

interface JPYAmountInputProps {
  value: number;
  onChange: (value: number) => void;
  error?: string;
  disabled?: boolean;
}

export function JPYAmountInput({ value, onChange, error, disabled }: JPYAmountInputProps) {
  const [inputValue, setInputValue] = useState(value.toString());

  useEffect(() => {
    setInputValue(value.toString());
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputVal = e.target.value;
    setInputValue(inputVal);

    // 数値のみ許可
    if (inputVal === '' || /^\d+$/.test(inputVal)) {
      const numValue = parseInt(inputVal) || 0;
      onChange(numValue);
    }
  };

  const handleBlur = () => {
    // 1000円単位に丸める
    const roundedValue = Math.floor(value / 1000) * 1000;
    if (roundedValue !== value) {
      onChange(roundedValue);
      setInputValue(roundedValue.toString());
    }
  };

  const increment = () => {
    const newValue = value + 1000;
    onChange(newValue);
    setInputValue(newValue.toString());
  };

  const decrement = () => {
    const newValue = Math.max(1000, value - 1000);
    onChange(newValue);
    setInputValue(newValue.toString());
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        JPY金額
      </label>
      
      <div className="relative">
        <div className="flex">
          <button
            type="button"
            onClick={decrement}
            disabled={disabled || value <= 1000}
            className="px-3 py-2 border border-r-0 border-gray-300 rounded-l-md bg-gray-50 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            -
          </button>
          
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputValue}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={disabled}
              className="w-full px-3 py-2 border border-gray-300 text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
              placeholder="1000"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
              ¥
            </div>
          </div>
          
          <button
            type="button"
            onClick={increment}
            disabled={disabled}
            className="px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            +
          </button>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      <p className="text-xs text-gray-500">
        ¥1,000単位で入力してください（最小: ¥1,000）
      </p>
    </div>
  );
}
