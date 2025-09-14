# Cursor Coding Rules for Base Escrow dApp

## 1. 開発スタイル
- **Vibe Coding 前提**: AI ペアプロとして進める。逐次レビューと改善を行う。
- **Spec-Driven Development**: `specs/specify.md`, `specs/plan.md`, `specs/tasks.md` を常に優先して参照。
- **小さなPR単位**: 大きな変更ではなく、タスクごとに小分けで提案させる。
- **次にやることを明確化**: `specs/specify.md`, `specs/plan.md`, `specs/tasks.md` を参照し、今どの作業をやっていて、どの作業が完了したかを明言し、次にやることを出力してください。


## 2. スマートコントラクト
- **言語/環境**: Solidity 0.8.x, Hardhat。
- **依存ライブラリ**: OpenZeppelin を優先使用。
- **禁止事項**:
  - `tx.origin` の使用禁止。
  - 生の `call` より `SafeERC20` を利用。
- **必須要件**:
  - Escrow は ETH, USDC, USDT のみ。
  - JPY 1000 円単位でのみ作成可能。
  - $5000 USD 相当の上限。
  - Oracle は **Chainlink** の価格のみ参照。
  - Release/Refund 実行は Maker のみ。

## 3. フロントエンド
- **フレームワーク**: Next.js + TypeScript。
- **Wallet 接続**: wagmi + viem + OnchainKit。
- **UI/UX**:
  - モバイル縦型デザインを優先。
  - CTA ボタンはフル幅。
  - 「あと X分Y秒で Refund 可能」カウントダウンを必ず表示。
  - 価格は60秒ごとに自動更新、±1%以上の変動で警告。

## 4. テスト
- **Solidity**: Hardhat で unit test。
- **フロント**: Playwright で E2E テスト。
- **必須テストケース**:
  - Escrow 作成/Release/Refund の正常系。
  - OTC ハッシュ検証。
  - Deadline 経過後のみ Refund が可能。
  - Oracle 障害時に作成をブロック。

## 5. ドキュメント
- **Spec Kit** に沿って更新。
- `README.md` にセットアップ・デモ方法を必ず反映。
- ハッカソン用の **Demo Script** を `docs/demo.md` に用意。

## 6. プロンプト運用ルール
- **指示の基本形**:
  - 「specs/tasks.md のタスク X を実装してください」
  - 「Escrow.sol に OTC ハッシュ検証ロジックを追加してください」
- **レビュー時**:
  - 生成コードは必ず差分形式で提案。
  - セキュリティ観点の指摘を優先。

---
