import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Base Escrow dApp
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            安全な対面取引のためのデモ用エスクローdApp
          </p>
          
          <div className="grid gap-6 md:grid-cols-2">
            <Link
              href="/new"
              className="card hover:shadow-lg transition-shadow duration-200"
            >
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                新しいエスクローを作成
              </h2>
              <p className="text-gray-600 mb-4">
                JPYと暗号通貨（ETH、USDC、USDT）の安全な交換を開始
              </p>
              <div className="btn-primary w-full">
                エスクローを作成
              </div>
            </Link>
            
            <div className="card">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                エスクローに参加
              </h2>
              <p className="text-gray-600 mb-4">
                エスクローIDを入力して既存のセッションに参加
              </p>
              <div className="btn-secondary w-full">
                セッションに参加
              </div>
            </div>
          </div>
          
          <div className="mt-12 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">
              ⚠️ デモ目的のみ
            </h3>
            <p className="text-yellow-700">
              このアプリケーションはハッカソンデモ用です。実際の金融取引には使用しないでください。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
