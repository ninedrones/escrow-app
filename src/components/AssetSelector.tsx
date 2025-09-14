'use client';

interface AssetSelectorProps {
  value: 'ETH' | 'USDC' | 'USDT';
  onChange: (value: 'ETH' | 'USDC' | 'USDT') => void;
  disabled?: boolean;
}

const assets = [
  {
    id: 'ETH' as const,
    name: 'Ethereum',
    symbol: 'ETH',
    icon: 'Ξ',
    color: 'bg-blue-100 text-blue-600',
  },
  {
    id: 'USDC' as const,
    name: 'USD Coin',
    symbol: 'USDC',
    icon: '$',
    color: 'bg-green-100 text-green-600',
  },
  {
    id: 'USDT' as const,
    name: 'Tether',
    symbol: 'USDT',
    icon: '₮',
    color: 'bg-yellow-100 text-yellow-600',
  },
];

export function AssetSelector({ value, onChange, disabled }: AssetSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        暗号通貨アセット
      </label>
      
      <div className="grid grid-cols-1 gap-3">
        {assets.map((asset) => (
          <button
            key={asset.id}
            type="button"
            onClick={() => onChange(asset.id)}
            disabled={disabled}
            className={`p-4 border-2 rounded-lg text-left transition-all ${
              value === asset.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${asset.color}`}>
                <span className="font-bold text-lg">{asset.icon}</span>
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900">{asset.name}</div>
                <div className="text-sm text-gray-500">{asset.symbol}</div>
              </div>
              {value === asset.id && (
                <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
