import Link from 'next/link';
import { WalletConnect } from '@/components/WalletConnect';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Base Escrow dApp
            </h1>
            <p className="text-lg text-gray-600">
              安全な現金（JPY）と暗号通貨の交換プラットフォーム
            </p>
          </div>
          <WalletConnect />
        </header>

        <main className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Escrowサービスについて
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  🛡️ 安全な取引
                </h3>
                <p className="text-gray-600 mb-4">
                  Baseチェーン上で動作するEscrowコントラクトにより、
                  現金と暗号通貨の安全な交換を実現します。
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• デフォルト30分のデッドライン</li>
                  <li>• 最大24時間の設定可能</li>
                  <li>• ¥1,000単位での取引</li>
                  <li>• $5,000 USD上限</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  💰 対応アセット
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-bold">Ξ</span>
                    </div>
                    <span className="text-gray-700">Ethereum (ETH)</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 font-bold">$</span>
                    </div>
                    <span className="text-gray-700">USD Coin (USDC)</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                      <span className="text-yellow-600 font-bold">₮</span>
                    </div>
                    <span className="text-gray-700">Tether (USDT)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Link
              href="/new"
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow block"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                新しいEscrowを作成
              </h3>
              <p className="text-gray-600 mb-6">
                暗号通貨を預けて、現金での受け取りを待ちます。
              </p>
              <div className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors text-center">
                作成する
              </div>
            </Link>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                既存のEscrowに参加
              </h3>
              <p className="text-gray-600 mb-6">
                QRコードをスキャンして、既存のEscrowに参加します。
              </p>
              <div className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 transition-colors text-center">
                参加する
              </div>
            </div>

            <Link
              href="/logs"
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow block"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                ログを確認
              </h3>
              <p className="text-gray-600 mb-6">
                すべてのEscrowイベントの履歴を表示します。
              </p>
              <div className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-purple-700 transition-colors text-center">
                ログを見る
              </div>
            </Link>
          </div>

          <div className="mt-12 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">
              ⚠️ デモ目的のみ
            </h3>
            <p className="text-yellow-700">
              このアプリケーションはハッカソンデモ用です。実際の金融取引には使用しないでください。
            </p>
          </div>
        </main>

        <footer className="mt-16 text-center text-gray-500">
          <p>Base Escrow dApp - Demo Only</p>
        </footer>
      </div>
    </div>
  );
}
