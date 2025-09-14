import { PriceTest } from '@/components/PriceTest';

export default function TestPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">
          CoinMarketCap API テスト
        </h1>
        <PriceTest />
      </div>
    </div>
  );
}
